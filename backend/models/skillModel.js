const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
    trim: true,
  },
  moudle_id: {
    type: String,
    required: [true, "Moudle id is required"],
  },
  module_type: {
    type: String,
    required: [true, "Module type is required"],
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

skillSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
