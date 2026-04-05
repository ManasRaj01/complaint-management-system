const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    studentId: String,
    studentName: String,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);