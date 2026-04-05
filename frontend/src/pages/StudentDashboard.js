import { useState, useEffect } from "react";
import axios from "axios";

function StudentDashboard() {
  const studentId = localStorage.getItem("userId");
  const studentName = localStorage.getItem("userName");

  const [activeOption, setActiveOption] = useState("submit");
  const [complaintForm, setComplaintForm] = useState({ title: "", description: "" });
  const [feedbackForm, setFeedbackForm] = useState({ title: "", description: "" });
  const [submitMsg, setSubmitMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [myComplaints, setMyComplaints] = useState([]);

  const fetchMyComplaints = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/complaints?studentId=${studentId}`
      );
      setMyComplaints(res.data.complaints || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeOption === "mycomplaints") fetchMyComplaints();
  }, [activeOption]);

  const handleSubmitComplaint = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/complaints/submit",
        {
          studentId,
          studentName,
          title: complaintForm.title,
          description: complaintForm.description,
        }
      );

      setSubmitMsg(`Complaint submitted! Your ID: ${res.data.complaintId}`);
      setComplaintForm({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      setSubmitMsg("Failed to submit complaint");
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/feedback/submit",
        {
          studentId,
          studentName,
          title: feedbackForm.title,
          description: feedbackForm.description,
        }
      );

      setFeedbackMsg(`Feedback submitted! Your ID: ${res.data.feedbackId}`);
      setFeedbackForm({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      setFeedbackMsg("Failed to submit feedback");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const centerCardStyle = {
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "black",
    width: "400px",
    margin: "0 auto",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "30px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Student Dashboard</h1>
          <h4 style={{ marginTop: "5px" }}>Hello, {studentName}!</h4>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Options */}
      <div className="mb-4 text-center">
        {["submit", "mycomplaints", "feedback"].map((option) => (
          <button
            key={option}
            className={`btn me-2 ${
              activeOption === option ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => setActiveOption(option)}
          >
            {option === "submit"
              ? "File a Complaint"
              : option === "mycomplaints"
              ? "My Complaints"
              : "Feedback"}
          </button>
        ))}
      </div>

      {/* File Complaint */}
      {activeOption === "submit" && (
        <div className="card shadow-sm p-4" style={centerCardStyle}>
          <h3 className="mb-3 text-center">File a Complaint</h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            value={complaintForm.title}
            onChange={(e) =>
              setComplaintForm({ ...complaintForm, title: e.target.value })
            }
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={complaintForm.description}
            onChange={(e) =>
              setComplaintForm({ ...complaintForm, description: e.target.value })
            }
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleSubmitComplaint}
          >
            Submit Complaint
          </button>
          {submitMsg && <div className="alert alert-success mt-2">{submitMsg}</div>}
        </div>
      )}

      {/* My Complaints */}
      {activeOption === "mycomplaints" && (
        <div
          className="card shadow-sm p-4"
          style={{ backgroundColor: "rgba(255,255,255,0.95)", color: "black" }}
        >
          <h3 className="mb-3">My Complaints</h3>
          {myComplaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {myComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c._id}</td>
                    <td>{c.title}</td>
                    <td>{c.status}</td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Feedback */}
      {activeOption === "feedback" && (
        <div className="card shadow-sm p-4" style={centerCardStyle}>
          <h3 className="mb-3 text-center">Submit Feedback</h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            value={feedbackForm.title}
            onChange={(e) =>
              setFeedbackForm({ ...feedbackForm, title: e.target.value })
            }
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={feedbackForm.description}
            onChange={(e) =>
              setFeedbackForm({ ...feedbackForm, description: e.target.value })
            }
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleSubmitFeedback}
          >
            Submit Feedback
          </button>
          {feedbackMsg && (
            <div className="alert alert-success mt-2">{feedbackMsg}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;