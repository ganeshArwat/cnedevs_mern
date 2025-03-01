const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a Title"],
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },
  start_date: {
    type: Date,
    required: [true, "Please enter a start date"],
  },
  end_date: Date,
  is_current: Boolean,
  project_url: String,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Project must belong to a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

projectSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
