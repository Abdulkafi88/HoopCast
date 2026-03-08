import React from "react"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1 style={{ fontSize: "5rem", color: "var(--primary-color)" }}>404</h1>
      <h2 style={{ marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ color: "#777", marginBottom: "2rem" }}>
        Looks like this page doesn't exist.
      </p>
      <Link
        to="/home"
        style={{
          padding: "0.75rem 2rem",
          backgroundColor: "var(--primary-color)",
          color: "white",
          borderRadius: "5px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
