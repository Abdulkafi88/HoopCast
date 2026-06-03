import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../Firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { checkRateLimit, recordAttempt } from "../utils/rateLimit"
import usePageTitle from "../hooks/usePageTitle"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  usePageTitle("Login")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    const { allowed, remaining } = checkRateLimit("login")
    if (!allowed) {
      setError(`Too many login attempts. Try again in ${remaining} minute${remaining !== 1 ? "s" : ""}.`)
      return
    }

    recordAttempt("login")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/home')
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Incorrect email or password.")
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.")
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.")
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin} noValidate>
        <h1>Welcome Back</h1>
        <p>Please login to your account</p>
        <div className="input-group">
          <label htmlFor="login-email">Email address</label>
          <input
            type="email"
            name="email"
            id="login-email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            name="password"
            id="login-password"
            placeholder="Your password"
            required
            autoComplete="current-password"
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p role="alert" style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="bottom-text">
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/newregister">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register
