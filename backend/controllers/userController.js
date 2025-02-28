const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.memoryStorage();

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
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProfileMedia = upload.fields([
  { name: "profile_image", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

exports.resizeProfileImage = catchAsync(async (req, res, next) => {
  if (!req.files.profile_image && !req.files.resume) return next();

  // 1) Profile Image
  if (req.files.profile_image) {
    req.body.profile_image = `user_profile_image-${
      req.user.id
    }-${Date.now()}.jpeg`;
    await sharp(req.files.profile_image[0].buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(
        `public/client_media/users/profile_images/${req.body.profile_image}`
      );
  }

  // 2) Resume
  console.log(req.files);

  if (req.files.resume) {
    req.body.resume = `user_resume-${req.user.id}-${Date.now()}.pdf`;
    const resumePath = path.join(
      __dirname,
      "../public/client_media/users/resumes",
      req.body.resume
    );

    // Write the PDF file to the server
    fs.writeFileSync(resumePath, req.files.resume[0].buffer);
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  // 2) Update user document

  const allowedFields = [
    "fname",
    "lname",
    "title",
    "short_description",
    "long_description",
    "phone",
    "address",
    "linkedin_url",
    "github_url",
    "profile_image",
    "resume",
  ];

  const filteredBody = filterObj(req.body, ...allowedFields);

  // if(req.file && ){
  //   filteredBody.profile_image = req.file.filename;
  // }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
