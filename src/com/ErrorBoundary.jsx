import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="content-holders" style={{ textAlign: "center", marginTop: "6rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Something went wrong.</h2>
          <p style={{ color: "#777", marginBottom: "2rem" }}>
            An unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            className="profile-btn"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
