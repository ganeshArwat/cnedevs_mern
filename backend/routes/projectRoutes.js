const express = require("express");
const projectController = require("../controllers/projectController");
const authController = require("../controllers/authController");
const uploadHandler = require("../utils/uploadHelper");

const router = express.Router();

// post - "/" - create a new project
// get - "/" - get all projects
// get - "/:id" - get project by id
// get - "/get_user_project/:user_id" - get all projects of a user
// patch - "/:id" - update project by id
// delete - "/:id" - delete project by id

router
  .route("/")
  .post(
    authController.protect,
    uploadHandler("client_media/project", "project", "attachments", 5),
    projectController.createProject
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    projectController.getAllProjects
  );

router
  .route("/get_user_project/:user_id")
  .get(projectController.getUserProjects);
router
  .route("/:id")
  .get(projectController.getProject)
  .patch(authController.protect, projectController.updateProject)
  .delete(authController.protect, projectController.deleteProject);

module.exports = router;
