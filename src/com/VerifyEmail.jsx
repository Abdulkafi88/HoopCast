import React, { useState } from "react"
import { Link } from "react-router-dom"
import { auth } from "../Firebase"
import { sendEmailVerification } from "firebase/auth"
import usePageTitle from "../hooks/usePageTitle"

const VerifyEmail = () => {
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)
  usePageTitle("Verify Email")

  const handleResend = async () => {
    if (!auth.currentUser) return
    setLoading(true)
    try {
      await sendEmailVerification(auth.currentUser)
      setResent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✉️</div>
        <h1 style={{ marginBottom: "0.5rem" }}>Verify your email</h1>
        <p style={{ color: "#777", marginBottom: "1.5rem" }}>
          We sent a verification link to your email address. Click the link in the email to activate your account.
        </p>
        {resent && (
          <p style={{ color: "#38a169", marginBottom: "1rem", fontSize: "0.9rem" }}>
            Verification email resent.
          </p>
        )}
        <button
          onClick={handleResend}
          disabled={loading || resent}
          className="profile-btn"
          style={{ marginBottom: "1rem", width: "100%" }}
        >
          {loading ? "Sending..." : resent ? "Email sent!" : "Resend verification email"}
        </button>
        <div className="bottom-text">
          <p>
            Already verified? <Link to="/home">Go to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
