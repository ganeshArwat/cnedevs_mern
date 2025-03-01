const multer = require("multer");
const AttachmentModel = require("./../models/attachmentModel");
const catchAsync = require("./../utils/catchAsync");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/appError");

// ✅ Dynamic Upload Handler
const uploadHandler = (uploadPath, prefix, fileFieldName, maxCount) => {
  // 1) Create storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join(__dirname, `../public/${uploadPath}`);

      // Create the directory if it doesn't exist
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname); // Extract file extension
      const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
      const uniqueName = `${prefix}-${
        req.user.id
      }${Date.now()}${randomNum}${fileExt}`;

      // Store filename and upload path in req.body
      if (!req.body.attachments) req.body.attachments = [];
      req.body.attachments.push({
        filename: uniqueName,
        path: `/public/${uploadPath}/${uniqueName}`, // Relative path
      });

      cb(null, uniqueName);
    },
  });

  // 2) Filter files
  const multerFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("application/pdf")
    ) {
      cb(null, true);
    } else {
      cb(new AppError("Only images or PDFs are allowed!", 400), false);
    }
  };

  // 3) Create upload instance
  const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
  });

  return upload.array(fileFieldName, maxCount);
};

module.exports = uploadHandler;
