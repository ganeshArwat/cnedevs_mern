const express = require("express");
const experienceController = require("../controllers/experienceController");
const authController = require("../controllers/authController");
const uploadHandler = require("../utils/uploadHelper");

const router = express.Router();

// post - "/" - create a new experience
// get - "/" - get all experiences
// get - "/:id" - get experience by id
// get - "/get_user_experience/:user_id" - get all experiences of a user
// patch - "/:id" - update experience by id
// delete - "/:id" - delete experience by id

router
  .route("/")
  .post(
    authController.protect,
    uploadHandler("client_media/experience", "experience", "attachments", 5),
    experienceController.createExperience
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    experienceController.getAllExperiences
  );

router
  .route("/get_user_experience/:user_id")
  .get(experienceController.getUserExperiences);
router
  .route("/:id")
  .get(experienceController.getExperience)
  .patch(authController.protect, experienceController.updateExperience)
  .delete(authController.protect, experienceController.deleteExperience);

module.exports = router;
