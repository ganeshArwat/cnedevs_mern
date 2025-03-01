const express = require("express");
const attachmentController = require("../controllers/attachmentController");
const authController = require("../controllers/authController");

const router = express.Router();

// post - "/" - create a new upload
// get - "/" - get all uploads
// get - "/:id" - get upload by id
// get - "/get_user_upload/:user_id" - get all uploads of a user
// patch - "/:id" - update upload by id
// delete - "/:id" - delete upload by id

router
  .route("/upload")
  .post(
    authController.protect,
    attachmentController.uploadAttachments,
    attachmentController.uploadFiles
  );

router.route("/:id").get(attachmentController.getAttachment).delete(attachmentController.deleteAttachment);

module.exports = router;
