import React, { useState, useEffect, lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Nav from "./com/Nav"
import ProtectedRoute from "./com/ProtectedRoute"
import { DarkModeProvider } from "./context/DarkModeContext"
import useNotifications from "./hooks/useNotifications"
import { auth } from "./Firebase"

const Home = lazy(() => import("./com/Home"))
const Teams = lazy(() => import("./com/Teams"))
const Register = lazy(() => import("./com/Register"))
const NewRegister = lazy(() => import("./com/NewRegister"))
const Savegames = lazy(() => import("./com/Savegames"))
const NotFound = lazy(() => import("./com/NotFound"))
const GameDetail = lazy(() => import("./com/GameDetail"))
const Standings = lazy(() => import("./com/Standings"))
const PlayerSearch = lazy(() => import("./com/PlayerSearch"))
const PlayerDetail = lazy(() => import("./com/PlayerDetail"))
const PlayerComparison = lazy(() => import("./com/PlayerComparison"))
const TeamDetail = lazy(() => import("./com/TeamDetail"))
const Profile = lazy(() => import("./com/Profile"))
const Onboarding = lazy(() => import("./com/Onboarding"))

function AppInner() {
  const [user, setUser] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem("onboardingDone")
  )
  useNotifications()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser)
    })
    return () => unsubscribe()
  }, [])

  if (showOnboarding) {
    return (
      <Suspense fallback={null}>
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </Suspense>
    )
  }

  return (
    <>
      <Nav user={user} />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/players" element={<PlayerSearch />} />
          <Route path="/player/:playerId" element={<PlayerDetail />} />
          <Route path="/compare" element={<PlayerComparison />} />
          <Route path="/team/:teamId" element={<TeamDetail />} />
          <Route path="/game/:gameId" element={<GameDetail />} />
          <Route path="/savegames" element={<ProtectedRoute><Savegames /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/newregister" element={<NewRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

function App() {
  useEffect(() => {
    const loader = document.getElementById("app-loader")
    if (loader) {
      loader.style.transition = "opacity 0.4s ease"
      loader.style.opacity = "0"
      setTimeout(() => loader.remove(), 400)
    }
  }, [])

  return (
    <DarkModeProvider>
      <AppInner />
    </DarkModeProvider>
  )
}

export default App
