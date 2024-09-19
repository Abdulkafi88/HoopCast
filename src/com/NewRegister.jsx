import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const NewRegister = ({ onSignIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      navigate('/Home')
      // onSignIn(userCredential.user)
      console.log("User signed up:", userCredential.user)
    } catch (error) {
      console.error("Error during signup:", error.message)
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
          <button type="submit">Login</button>
          <div className="bottom-text">
            <p>
              have an account? <Link to={"/Register"}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </React.Fragment>
  )
}

export default NewRegister