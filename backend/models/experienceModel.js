const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
    trim: true,
  },
  company: {
    type: String,
    required: [true, "Please enter a company"],
    trim: true,
  },
  employment_type: {
    type: String,
    required: [
      true,
      'Please enter a employment type within [ "full-time","part-time","self-employed","freelance","internship","trainee"]',
    ],
    enum: [
      "full-time",
      "part-time",
      "self-employed",
      "freelance",
      "internship",
      "trainee",
    ],
  },
  start_date: {
    type: Date,
    required: [true, "Please enter a start date"],
  },
  end_date: Date,
  is_current: Boolean,
  description: String,
  location: String,
  location_type: {
    type: String,
    required: [
      true,
      'Please enter a employment type within ["on-site", "remote", "hybrid"]',
    ],
    enum: ["on-site", "remote", "hybrid"],
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Experience must belong to a user"],
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

experienceSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;
