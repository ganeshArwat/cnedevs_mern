const multer = require("multer");
const sharp = require("sharp");
const Experience = require("./../models/experienceModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.createExperience = factory.createOne(Experience, true, 1);

exports.updateExperience = factory.updateOne(Experience);

exports.deleteExperience = factory.deleteOne(Experience);

exports.getAllExperiences = factory.getAll(Experience);
exports.getUserExperiences = factory.getAll(Experience, true, 1);
exports.getExperience = factory.getOne(Experience, 1);
