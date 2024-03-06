// App.jsx
import React, { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./com/Home"
import Nav from "./com/Nav"
import Teams from "./com/Teams"
import Register from "./com/Register"
import NewRegister from "./com/NewRegister"
import Savegames from "./com/Savegames"
import { auth } from "./Firebase"

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  console.log("user in App:", user)

  const handleSignIn = (signedInUser) => {
    setUser(signedInUser)
  }

  const handleGameSave = () => {
    // You can perform any actions when a game is saved
    console.log("Game saved")
  }

  return (
    <>
      <Nav user={user} />

      <Routes>
        <Route path="Teams" element={<Teams onGameSave={handleGameSave} />} />
        <Route path="Home" element={<Home />} />
        <Route path="Savegames" element={<Savegames />} />
        <Route path="Register" element={<Register onSignIn={handleSignIn} />} />
        <Route
          path="NewRegister"
          element={<NewRegister onSignIn={handleSignIn} />}
        />
      </Routes>
    </>
  )
}

export default App
