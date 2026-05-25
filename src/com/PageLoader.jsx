import React from "react"

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
    role="status"
    aria-label="Loading page"
  >
    <div className="page-loader-spinner" />
  </div>
)

export default PageLoader
