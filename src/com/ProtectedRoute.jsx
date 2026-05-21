import React, { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../Firebase"

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, user: null })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({ loading: false, user })
    })
    return () => unsubscribe()
  }, [])

  if (authState.loading) return null
  if (!authState.user) return <Navigate to="/register" replace />
  return children
}

export default ProtectedRoute
