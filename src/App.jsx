import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./com/Home";
import Nav from "./com/Nav";
import Teams from "./com/Teams";
import Register from "./com/Register";
import NewRegister from "./com/NewRegister";
import Savegames from "./com/Savegames";
import { auth } from "./Firebase";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router basename="/HoopCast">
      <Nav user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Teams" element={<Teams />} />
        <Route path="/Savegames" element={<Savegames />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/NewRegister" element={<NewRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
