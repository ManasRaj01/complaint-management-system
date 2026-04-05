const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post("/submit", async (req, res) => {
  try {
    const { studentId, studentName, feedback } = req.body;

    const newFeedback = new Feedback({
      studentId,
      studentName,
      feedback,
    });

    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;