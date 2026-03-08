import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const NewRegister = ({ onSignIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

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
    <React.Fragment>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSignup}>
          <h1>Welcome </h1>
          <p>Please Sign up</p>
          <div className="input-group">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="email"
              required
              style={{ backgroundColor: "white", color: "black" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              style={{ backgroundColor: "white", color: "black" }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>}
          <button type="submit">Sign Up</button>
          <div className="bottom-text">
            <p>
              have an account? <Link to={"/register"}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </React.Fragment>
  )
}

export default NewRegister