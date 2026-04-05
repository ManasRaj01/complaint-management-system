import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        form
      );
      alert(res.data.message);
      navigate("/");
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card shadow"
        style={{
          width: "380px",
          backgroundColor: "#e9e9e9",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <h3 className="text-center mb-4">Register</h3>

        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="form-select mb-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button
          className="btn btn-success w-100"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="text-center mt-3">
          Already have account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;