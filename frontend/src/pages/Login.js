import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/background.jpg"; // make sure the path is correct

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", form);

      // Save user info in localStorage
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);

      alert(res.data.message);

      // Navigate based on role
      if (res.data.user.role === "student") navigate("/student");
      else if (res.data.user.role === "admin") navigate("/admin");
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "40px",
          textAlign: "center",
          textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
        }}
      >
        Complaint Management Portal
      </div>

      {/* Login Card */}
      <div
        className="card p-4 shadow-sm"
        style={{
          width: "360px",
          backgroundColor: "rgba(255,255,255,0.9)", // semi-transparent white
          color: "black",
        }}
      >
        <h3 className="text-center mb-4">Login</h3>

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

        <button
          className="btn btn-success w-100 mb-2"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center mt-2">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;