const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  school_name: {
    type: String,
    required: [true, "Please enter a school name"],
    trim: true,
  },
  degree_name: {
    type: String,
    required: [true, "Please enter a degree name"],
    trim: true,
  },
  field_of_study: {
    type: String,
    required: [true, "Please enter a Field of Study"],
    trim: true,
  },
  start_date: {
    type: Date,
    required: [true, "Please enter a start date"],
  },
  end_date: Date,
  is_current: Boolean,
  grade: {
    type: String,
    required: [true, "Please enter a grade"],
    trim: true,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Education must belong to a user"],
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

educationSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
