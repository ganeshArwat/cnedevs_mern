const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a Title"],
    trim: true,
  },
  issuer: {
    type: String,
    required: [true, "Please enter a Issuing Organization"],
    trim: true,
  },

  issued_date: {
    type: Date,
    required: [true, "Please enter a issued date"],
  },
  expiration_date: Date,
  credential_id: String,
  credential_url: String,
  credential_img: String,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Certification must belong to a user"],
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

certificationSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const Certification = mongoose.model("Certification", certificationSchema);

module.exports = Certification;
