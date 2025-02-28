const multer = require("multer");
const AttachmentModel = require("./../models/attachmentModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "../public/client_media/experience"
    );
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // Extract file extension
    const randomNum = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit random number
    const uniqueName = `experience-${
      req.user.id
    }${Date.now()}${randomNum}${fileExt}`;
    cb(null, uniqueName);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("application/pdf")
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not an image or Pdf! Please upload only images or Pdf file.",
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

exports.uploadAttachments = upload.array("attachments", 5); // Max 5 files

exports.uploadFiles = catchAsync(async (req, res) => {
  const { module_type, module_id, title } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded!" });
  }

  // Split titles based on "|" separator
  const titles = title ? title.split(" | ") : [];

  // Map files to database objects
  const attachments = req.files.map((file, index) => ({
    title: titles[index] || `Attachment ${index + 1}`, // Default title if not provided
    file: `${file.filename}`,
    module_id,
    module_type,
  }));

  // Save to database
  const insert_res = await AttachmentModel.insertMany(attachments);

  // Fetch data again and exclude fields
  const sanitizedData = await AttachmentModel.find({
    _id: { $in: insert_res.map((doc) => doc._id) },
  }).select("-module_id -module_type -active"); // Exclude hidden fields

  res.status(201).json({
    status: "success",
    data: {
      data: sanitizedData,
    },
  });
});
