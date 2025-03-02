const multer = require("multer");
const sharp = require("sharp");
const Education = require("./../models/educationModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.createEducation = factory.createOne(Education, true, 2);

exports.updateEducation = factory.updateOne(Education);

exports.deleteEducation = factory.deleteOne(Education);

exports.getAllEducations = factory.getAll(Education);
exports.getUserEducations = factory.getAll(Education, true, 2);
exports.getEducation = factory.getOne(Education, 2);
