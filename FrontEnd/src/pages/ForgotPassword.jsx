import React, { useState, useRef, useEffect } from "react";
import api from "../api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);

  // ================================
  // OTP TIMER COUNTDOWN
  // ================================
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, step]);

  // ================================
  // SEND OTP
  // ================================
  const handleSendOtp = async () => {
    setMessage("");
    if (!email.trim()) return setMessage("Enter your email");

    try {
      await api.post("/auth/request-reset", { email });
      setStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send OTP.");
    }
  };

  // ================================
  // RESEND OTP
  // ================================
  const handleResend = async () => {
    try {
      await api.post("/auth/request-reset", { email });
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setMessage("Failed to resend OTP");
    }
  };

  // ================================
  // HANDLE OTP INPUT
  // ================================
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value !== "" && index < 5)
      otpRefs.current[index + 1].focus();

    if (value === "" && index > 0)
      otpRefs.current[index - 1].focus();
  };

  // ================================
  // VERIFY OTP
  // ================================
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    try {
      await api.post("/auth/verify-reset", { email, otp: finalOtp });
      setStep(3);
      setMessage("");
    } catch (err) {
      setMessage("Incorrect OTP");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // ================================
  // PASSWORD STRENGTH METER
  // ================================
  const checkStrength = () => {
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  };

  const strengthText = ["Weak", "Moderate", "Good", "Strong"];
  const strengthColors = ["#ff4d4d", "#ff9900", "#00cc66", "#0099ff"];

  // ================================
  // UPDATE PASSWORD
  // ================================
  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) return;

    try {
      await api.post("/auth/update-password", {
        email,
        password: newPassword,
      });

      setMessage("Password updated successfully ✔");
      setStep(1);
    } catch {
      setMessage("Failed to update password");
    }
  };

  return (
    <div className="forgot-container">

      {/* STEP 1 — ENTER EMAIL */}
      {step === 1 && (
        <div className="forgot-card fade-in">
          <h2>Reset Password</h2>
          <p className="muted">Enter your registered email</p>

          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && <p className="error">{message}</p>}

          <button className="btn-primary" onClick={handleSendOtp}>
            Send OTP
          </button>
        </div>
      )}

      {/* STEP 2 — OTP */}
      {step === 2 && (
        <div className={`forgot-card fade-in ${shake ? "shake" : ""}`}>
          <h2>Enter OTP</h2>
          <p className="muted">We sent a 6-digit code to your email</p>

          <div className="otp-box">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                ref={(el) => (otpRefs.current[idx] = el)}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
              />
            ))}
          </div>

          {!canResend ? (
            <p className="timer-text">Resend OTP in <b>{timer}s</b></p>
          ) : (
            <button className="resend-btn" onClick={handleResend}>
              Resend OTP
            </button>
          )}

          {message && <p className="error">{message}</p>}

          <button className="btn-primary" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </div>
      )}

      {/* STEP 3 — NEW PASSWORD */}
      {step === 3 && (
        <div className="forgot-card fade-in">
          <h2>Set New Password</h2>

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {/* PASSWORD STRENGTH BAR */}
          <div className="strength-wrapper">
            <div
              className="strength-bar"
              style={{
                width: `${(checkStrength() / 4) * 100}%`,
                background: strengthColors[checkStrength() - 1] || "#ddd",
              }}
            ></div>
          </div>
          <p className="strength-text">
            {newPassword && strengthText[checkStrength() - 1]}
          </p>

          {message && <p className="success">{message}</p>}

          <button className="btn-primary" onClick={handleUpdatePassword}>
            Update Password
          </button>
        </div>
      )}
    </div>
  );
}
