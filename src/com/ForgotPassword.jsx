import React, { useState } from "react"
import { Link } from "react-router-dom"
import { auth } from "../Firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import usePageTitle from "../hooks/usePageTitle"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  usePageTitle("Reset Password")

  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
        setError("No account found with that email address.")
      } else {
        setError("Could not send reset email. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="login-container">
        <div className="login-form" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Check your email</h1>
          <p style={{ color: "#777", marginBottom: "2rem" }}>
            We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
          </p>
          <Link to="/register" className="nav__btn" style={{ display: "inline-block" }}>
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleReset} noValidate>
        <h1>Reset Password</h1>
        <p>Enter your email and we'll send you a reset link.</p>
        <div className="input-group">
          <label htmlFor="reset-email">Email address</label>
          <input
            type="email"
            id="reset-email"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && (
          <p role="alert" style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <div className="bottom-text">
          <p>
            Remember your password? <Link to="/register">Back to Login</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
