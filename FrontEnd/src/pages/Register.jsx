import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import "./Register.css";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [role, setRole] = useState("");

  const [universities, setUniversities] = useState([]);

  // OTP phase
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Feedback
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load universities
  useEffect(() => {
    api.get("/universities").then((res) => setUniversities(res.data));
  }, []);

  // ============================================================
  // 1️⃣ SEND OTP
  // ============================================================
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !universityId || !role) {
      return setError("All fields are required.");
    }

    setError("");
    setLoading(true);

    try {
      // Check if uni exists
      const selectedUni = universities.find((u) => u.id === parseInt(universityId));
      if (!selectedUni) {
        setError("Please select a valid university.");
        setLoading(false);
        return;
      }

      // Send OTP
      await api.post("/auth/send-otp", { email });

      setOtpSent(true); // Switch to OTP screen
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 2️⃣ VERIFY OTP & REGISTER
  // ============================================================
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();

    if (otp.trim().length !== 6) {
      return setError("Enter the 6-digit OTP.");
    }

    setError("");
    setLoading(true);

    try {
      // Verify OTP
      await api.post("/auth/verify-otp", { email, otp });

      // Get university name
      const selectedUni = universities.find((u) => u.id === parseInt(universityId));

      const payload = {
        name: username,
        email,
        password,
        role,
        universityName: selectedUni.name,
      };

      // Register user
      await api.post("/auth/register", payload);

      // Auto login
      await login({ email, password });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="muted">Join CampusTalk today</p>

        {/* ============================================================
            STEP 1 — USER INFO FORM
        ============================================================ */}
        {!otpSent && (
          <form onSubmit={handleSendOtp}>
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
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* ============================================================
            STEP 2 — OTP VERIFICATION SCREEN
        ============================================================ */}
        {otpSent && (
          <form onSubmit={handleVerifyOtpAndRegister}>
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              placeholder="6-digit code"
              onChange={(e) => setOtp(e.target.value)}
            />

            <p className="muted">We sent a verification code to <strong>{email}</strong></p>

            {error && <p className="error">{error}</p>}

            <button className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleSendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
