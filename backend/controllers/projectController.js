const multer = require("multer");
const sharp = require("sharp");
const Project = require("./../models/projectModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.createProject = factory.createOne(Project, true, 1);

exports.updateProject = factory.updateOne(Project);

exports.deleteProject = factory.deleteOne(Project);

exports.getAllProjects = factory.getAll(Project);
exports.getUserProjects = factory.getAll(Project, true, 1);
exports.getProject = factory.getOne(Project, 1);
