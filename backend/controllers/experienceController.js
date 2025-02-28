const multer = require("multer");
const sharp = require("sharp");
const Experience = require("./../models/experienceModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.getAllExperiences = factory.getAll(Experience);
exports.getUserExperiences = factory.getAll(Experience, "user");
exports.getExperience = factory.getOne(Experience);
exports.createExperience = factory.createOne(Experience, "user");
exports.updateExperience = factory.updateOne(Experience);
exports.deleteExperience = factory.deleteOne(Experience);
