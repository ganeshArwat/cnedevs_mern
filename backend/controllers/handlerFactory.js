const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const AttachmentModel = require("./../models/attachmentModel");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No Document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model, save_user_id = false, module_type = 1) =>
  catchAsync(async (req, res, next) => {
    // Adding the user_id to the request body from jwt token
    if (save_user_id) req.body.user_id = req.user.id;

    // Inserting the data to the database
    const bodyData = Array.isArray(req.body) ? req.body : [req.body]; // Ensure it's an array
    const insert_body = bodyData.map(
      ({ attachments, attachments_titles, ...rest }) => rest
    );
    let doc = await Model.create(insert_body);

    // Convert Mongoose documents to plain objects
    doc = doc.map((doc) => doc.toObject());

    // If attachments are provided, save them to the database
    if (
      Array.isArray(req.body.attachments) &&
      req.body.attachments.length > 0 &&
      doc[0]._id
    ) {
      const doc_id = doc[0]._id;
      const { attachments_titles } = req.body;
      const titles = attachments_titles ? attachments_titles.split(" | ") : [];
      const attachments_insert = req.files.map((file, index) => ({
        title: titles[index] || `Attachment ${index + 1}`, // Default title if not provided
        file: `${file.filename}`,
        module_id: doc_id,
        module_type: module_type,
      }));

      // Save to database
      const insert_res = await AttachmentModel.insertMany(attachments_insert);

      // Fetch data again and exclude fields
      const sanitizedData = await AttachmentModel.find({
        _id: { $in: insert_res.map((doc) => doc._id) },
      }).select("-module_id -module_type -active"); // Exclude hidden fields

      doc[0].attachments = sanitizedData;
    }

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, module_type = 0, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // If module_type is provided, fetch attachments
    if (module_type > 0) {
      // Fetch attachments related to this document
      const attachments = await AttachmentModel.find({
        module_id: doc._id,
        module_type: module_type, // Filter by module_type
      }).select("-module_id -module_type -active"); // Exclude hidden fields

      // Convert to object and add attachments
      const docWithAttachments = { ...doc.toObject(), attachments };

      return res.status(200).json({
        status: "success",
        data: {
          data: docWithAttachments,
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, by_user_id = false, module_type = 0) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (by_user_id) filter = { user_id: req.params.user_id };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limintFields()
      .paginate();

    const docs = await features.query;

    // If module_type is provided, fetch attachments
    if (module_type > 0) {
      // Fetch attachments for each document
      const docsWithAttachments = await Promise.all(
        docs.map(async (doc) => {
          const attachments = await AttachmentModel.find({
            module_id: doc._id,
            module_type: module_type, // Filter attachments by module_type
          }).select("-module_id -module_type -active"); // Exclude fields

          return { ...doc.toObject(), attachments }; // Merge attachments into doc
        })
      );

      res.status(200).json({
        status: "success",
        results: docsWithAttachments.length,
        data: {
          data: docsWithAttachments,
        },
      });
    } else {
      res.status(200).json({
        status: "success",
        results: docs.length,
        data: {
          data: docs,
        },
      });
    }
  });
