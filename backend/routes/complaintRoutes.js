const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// -------------------- SUBMIT COMPLAINT --------------------
router.post("/submit", async (req, res) => {
  try {
    const { studentId, studentName, title, description } = req.body;
    if (!studentId || !studentName || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = new Complaint({
      studentId,
      studentName,
      title,
      description,
      status: "Pending",
    });

    await complaint.save();
    res.status(200).json({ message: "Complaint submitted successfully", complaintId: complaint._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- TRACK COMPLAINT --------------------
router.get("/track/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json({ complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- UPDATE STATUS --------------------
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    await complaint.save();

    res.status(200).json({ message: "Status updated successfully", complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET ALL COMPLAINTS (DATE-WISE OR STUDENT-WISE) --------------------
router.get("/", async (req, res) => {
  try {
    const { date, studentId } = req.query;
    let filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    if (studentId) filter.studentId = studentId;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;