import { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const adminName = localStorage.getItem("userName");
  const [activeOption, setActiveOption] = useState("complaints");

  const [complaints, setComplaints] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch complaints
  const fetchAllComplaints = async () => {
    try {
      let url = "http://localhost:5001/api/complaints";
      if (filterDate) url += `?date=${filterDate}`;
      const res = await axios.get(url);
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/feedback");
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeOption === "complaints") fetchAllComplaints();
    if (activeOption === "feedback") fetchFeedbacks();
  }, [activeOption]);

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdate({ ...statusUpdate, [id]: newStatus });
  };

  const updateStatus = async (id) => {
    try {
      const newStatus = statusUpdate[id];
      if (!newStatus) return;

      await axios.put(`http://localhost:5001/api/complaints/status/${id}`, {
        status: newStatus,
      });

      fetchAllComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fullWidthCardStyle = {
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "black",
    width: "100%",
    padding: "20px",
    marginBottom: "30px",
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Admin Dashboard</h1>
          <h4 style={{ marginTop: "5px" }}>Hello, {adminName}!</h4>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Options */}
      <div className="mb-4 text-center">
        <button
          className={`btn me-2 ${
            activeOption === "complaints" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => setActiveOption("complaints")}
        >
          Complaints
        </button>
        <button
          className={`btn me-2 ${
            activeOption === "feedback" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => setActiveOption("feedback")}
        >
          Feedback
        </button>
      </div>

      {/* Complaints Section */}
      {activeOption === "complaints" && (
        <div className="card shadow-sm" style={fullWidthCardStyle}>
          <h3 className="mb-3 text-center">View Complaints</h3>

          {/* Date Filter */}
          <div className="d-flex justify-content-center mb-3">
            <input
              type="date"
              className="form-control me-2"
              style={{ maxWidth: "200px" }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button className="btn btn-primary" onClick={fetchAllComplaints}>
              Submit
            </button>
          </div>

          {complaints.length === 0 ? (
            <p className="text-center">No complaints registered for this date.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                className="table table-striped table-bordered"
                style={{ minWidth: "1000px" }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id}>
                      <td>{c._id}</td>
                      <td>{c.title}</td>
                      <td>{c.description}</td>
                      <td>{c.studentName}</td>
                      <td>
                        <select
                          className="form-select"
                          value={statusUpdate[c._id] || c.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(c._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateStatus(c._id)}
                        >
                          Update
                        </button>
                      </td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Feedback Section */}
      {activeOption === "feedback" && (
        <div className="card shadow-sm" style={fullWidthCardStyle}>
          <h3 className="mb-3 text-center">Feedback</h3>
          {feedbacks.length === 0 ? (
            <p className="text-center">No feedback submitted yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                className="table table-striped table-bordered"
                style={{ minWidth: "800px" }}
              >
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Feedback</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f._id}>
                      <td>{f.studentName}</td>
                      <td>{f.message}</td>
                      <td>{new Date(f.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;