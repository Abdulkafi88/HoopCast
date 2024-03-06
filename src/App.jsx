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
      setUser(authUser)
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      <Nav user={user} />

      <Routes>
        <Route path="Teams" element={<Teams />} />
        <Route path="Home" element={<Home />} />
        <Route path="Savegames" element={<Savegames />} />
        <Route path="Register" element={<Register />} />
        <Route path="NewRegister" element={<NewRegister />} />
      </Routes>
    </>
  )
}

export default App
