import React from "react"

const Skeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-flags">
        <div className="skeleton-team">
          <div className="skeleton-circle"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-line tiny"></div>
        </div>
        <div className="skeleton-vs"></div>
        <div className="skeleton-team">
          <div className="skeleton-circle"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-line tiny"></div>
        </div>
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line small"></div>
      </div>
    </div>
  )
}

export default Skeleton
