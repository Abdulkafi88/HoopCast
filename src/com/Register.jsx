import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../Firebase"
import { signInWithEmailAndPassword } from "firebase/auth"


const Register = ({ onSignIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

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
    }
  }
  return (
    <React.Fragment>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Welcome Back</h1>
          <p>Please login to your account</p>
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
          <button type="submit">Login</button>
          <div className="bottom-text">
            <p>
              Don't have an account? <Link to={"/newregister"}>Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </React.Fragment>
  )
}

export default Register
