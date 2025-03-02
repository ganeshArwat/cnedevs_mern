const express = require("express");
const educationController = require("../controllers/educationController");
const authController = require("../controllers/authController");
const uploadHandler = require("../utils/uploadHelper");

const router = express.Router();

// post - "/" - create a new education
// get - "/" - get all educations
// get - "/:id" - get education by id
// get - "/get_user_education/:user_id" - get all educations of a user
// patch - "/:id" - update education by id
// delete - "/:id" - delete education by id

router
  .route("/")
  .post(
    authController.protect,
    uploadHandler("client_media/education", "education", "attachments", 5),
    educationController.createEducation
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    educationController.getAllEducations
  );

router
  .route("/get_user_education/:user_id")
  .get(educationController.getUserEducations);
router
  .route("/:id")
  .get(educationController.getEducation)
  .patch(authController.protect, educationController.updateEducation)
  .delete(authController.protect, educationController.deleteEducation);

module.exports = router;
