import React from "react"
import { Navigate } from "react-router-dom"
import { auth } from "../Firebase"

const ProtectedRoute = ({ children }) => {
  if (!auth.currentUser) {
    return <Navigate to="/register" replace />
  }
  return children
}

export default ProtectedRoute
