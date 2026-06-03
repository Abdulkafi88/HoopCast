import React, { useState, useEffect, lazy, Suspense } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Nav from "./com/Nav"
import ProtectedRoute from "./com/ProtectedRoute"
import ErrorBoundary from "./com/ErrorBoundary"
import PageLoader from "./com/PageLoader"
import { DarkModeProvider } from "./context/DarkModeContext"
import useNotifications from "./hooks/useNotifications"
import { auth } from "./Firebase"

const Home = lazy(() => import("./com/Home"))
const Teams = lazy(() => import("./com/Teams"))
const Register = lazy(() => import("./com/Register"))
const NewRegister = lazy(() => import("./com/NewRegister"))
const ForgotPassword = lazy(() => import("./com/ForgotPassword"))
const VerifyEmail = lazy(() => import("./com/VerifyEmail"))
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

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
      <Suspense fallback={<PageLoader />}>
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </Suspense>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Nav user={user} />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
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
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </DarkModeProvider>
  )
}

export default App
