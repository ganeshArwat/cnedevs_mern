const multer = require("multer");
const sharp = require("sharp");
const Certification = require("./../models/certificationModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.createCertification = factory.createOne(Certification, true, 1);

exports.updateCertification = factory.updateOne(Certification);

exports.deleteCertification = factory.deleteOne(Certification);

exports.getAllCertifications = factory.getAll(Certification);
exports.getUserCertifications = factory.getAll(Certification, true, 1);
exports.getCertification = factory.getOne(Certification, 1);
