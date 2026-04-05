const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/complaintPortal", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const complaintRoutes = require("./routes/complaintroutes");
app.use("/api/complaints", complaintRoutes);

const feedbackRoutes = require("./routes/feedback");
app.use("/api/feedback", feedbackRoutes);

// Start server
app.listen(5001, () => console.log("Server running on port 5001"));