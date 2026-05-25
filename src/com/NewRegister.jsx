import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../Firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { checkRateLimit, recordAttempt } from "../utils/rateLimit"
import usePageTitle from "../hooks/usePageTitle"

const NewRegister = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  usePageTitle("Sign Up")

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    const { allowed, remaining } = checkRateLimit("signup")
    if (!allowed) {
      setError(`Too many sign-up attempts. Try again in ${remaining} minute${remaining !== 1 ? "s" : ""}.`)
      return
    }

    recordAttempt("signup")

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/home')
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.")
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.")
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.")
      } else {
        setError("Sign up failed. Please try again.")
      }
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignup} noValidate>
        <h1>Welcome</h1>
        <p>Please sign up to get started</p>
        <div className="input-group">
          <label htmlFor="signup-email">Email address</label>
          <input
            type="email"
            name="email"
            id="signup-email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            name="password"
            id="signup-password"
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p role="alert" style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <button type="submit">Sign Up</button>
        <div className="bottom-text">
          <p>
            Already have an account? <Link to={"/register"}>Login</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default NewRegister
