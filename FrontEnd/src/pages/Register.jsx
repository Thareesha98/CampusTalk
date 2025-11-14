import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import "./Register.css";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [role, setRole] = useState(""); // ✅ new
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    api.get("/universities").then((res) => setUniversities(res.data));
  }, []);

 
const handleRegister = async (e) => {
  e.preventDefault();
  if (!username.trim() || !email.trim() || !password.trim() || !role || !universityId)
    return setError("All fields are required.");

  setError("");
  setLoading(true);

  try {
    // find selected university name by ID
    const selectedUni = universities.find((u) => u.id === parseInt(universityId));
    if (!selectedUni) {
      setError("Please select a valid university.");
      setLoading(false);
      return;
    }

    // ✅ simplified payload
    const payload = {
      name: username,
      email,
      password,
      role,
      universityName: selectedUni.name, // 🔁 key difference
    };

    console.log("➡ Sending registration payload:", payload);

    const res = await api.post("/auth/register", payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Registration success:", res.data);

    await login({ email, password });
    navigate("/");
  } catch (err) {
    console.error("❌ Registration error:", err.response?.data || err.message);
    setError(err.response?.data?.error || "Registration failed. Try again.");
  } finally {
    setLoading(false);
  }
};










  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="muted">Join CampusTalk today</p>

        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input
            type="text"
            value={username}
            placeholder="John Doe"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>University</label>
          <select value={universityId} onChange={(e) => setUniversityId(e.target.value)}>
            <option value="">Select University</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="STUDENT">Student</option>
            <option value="CHAIRMAN">Chairman</option>
            <option value="ADMIN">Admin</option>
          </select>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
