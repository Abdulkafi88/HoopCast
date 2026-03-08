import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./com/Home"
import Nav from "./com/Nav"
import Teams from "./com/Teams"
import Register from "./com/Register"
import NewRegister from "./com/NewRegister"
import Savegames from "./com/Savegames"
import ProtectedRoute from "./com/ProtectedRoute"
import NotFound from "./com/NotFound"
import GameDetail from "./com/GameDetail"
import Standings from "./com/Standings"
import PlayerSearch from "./com/PlayerSearch"
import PlayerDetail from "./com/PlayerDetail"
import PlayerComparison from "./com/PlayerComparison"
import TeamDetail from "./com/TeamDetail"
import Profile from "./com/Profile"
import Onboarding from "./com/Onboarding"
import { DarkModeProvider } from "./context/DarkModeContext"
import useNotifications from "./hooks/useNotifications"
import { auth } from "./Firebase"

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
    return <Onboarding onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <>
      <Nav user={user} />
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
    </>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <AppInner />
    </DarkModeProvider>
  )
}

export default App
