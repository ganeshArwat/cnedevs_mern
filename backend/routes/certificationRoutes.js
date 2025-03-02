const express = require("express");
const certificationController = require("../controllers/certificationController");
const authController = require("../controllers/authController");
const uploadHandler = require("../utils/uploadHelper");

const router = express.Router();

// post - "/" - create a new certification
// get - "/" - get all certifications
// get - "/:id" - get certification by id
// get - "/get_user_certification/:user_id" - get all certifications of a user
// patch - "/:id" - update certification by id
// delete - "/:id" - delete certification by id

router
  .route("/")
  .post(
    authController.protect,
    uploadHandler("client_media/certification", "certification", "attachments", 5),
    certificationController.createCertification
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    certificationController.getAllCertifications
  );

router
  .route("/get_user_certification/:user_id")
  .get(certificationController.getUserCertifications);
router
  .route("/:id")
  .get(certificationController.getCertification)
  .patch(authController.protect, certificationController.updateCertification)
  .delete(authController.protect, certificationController.deleteCertification);

module.exports = router;
