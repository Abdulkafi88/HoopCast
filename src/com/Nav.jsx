import React, { useState } from "react"
import { Link } from "react-router-dom"
import "../App.css"
import { auth } from "../Firebase"
import { signOut } from "firebase/auth"
import { useDarkMode } from "../context/DarkModeContext"
import GlobalSearch from "./GlobalSearch"

export default function Nav({ user }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useDarkMode()

  const handleSignOut = async () => {
    await signOut(auth)
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav role="navigation" aria-label="Main navigation">
      {/* Left: logo + search */}
      <div className="nav__left">
        <div className="nav__logo">
          <Link to="/home" onClick={closeMenu}>HoopCast</Link>
        </div>
        <div className="nav__search--desktop">
          <GlobalSearch />
        </div>
      </div>

      {/* Right: links + login + dark mode (desktop) */}
      <ul className="nav__links nav__links--desktop">
        <li className="link"><Link to="/home">Home</Link></li>
        <li className="link"><Link to="/teams">Games</Link></li>
        <li className="link"><Link to="/standings">Standings</Link></li>
        <li className="link"><Link to="/players">Players</Link></li>
        <li className="link"><Link to="/compare">Compare</Link></li>
        <li className="link"><Link to="/savegames">Saved</Link></li>
        {auth.currentUser ? (
          <>
            <li className="link"><Link to="/profile">Profile</Link></li>
            <li className="link">
              <button className="nav__logout-btn" onClick={handleSignOut}>Logout</button>
            </li>
          </>
        ) : (
          <li className="link">
            <Link to="/register" className="nav__btn">Login</Link>
          </li>
        )}
        <li className="link">
          <button
            className="dark-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </li>
      </ul>

      {/* Hamburger (mobile only) */}
      <button
        className="nav__hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <span className="hamburger__line"></span>
        <span className="hamburger__line"></span>
        <span className="hamburger__line"></span>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <ul id="mobile-menu" className="nav__links--mobile" role="menu">
          <li className="mobile-search-item"><GlobalSearch /></li>
          <li role="none"><Link to="/home" onClick={closeMenu}>Home</Link></li>
          <li role="none"><Link to="/teams" onClick={closeMenu}>Games</Link></li>
          <li role="none"><Link to="/standings" onClick={closeMenu}>Standings</Link></li>
          <li role="none"><Link to="/players" onClick={closeMenu}>Players</Link></li>
          <li role="none"><Link to="/compare" onClick={closeMenu}>Compare</Link></li>
          <li role="none"><Link to="/savegames" onClick={closeMenu}>Saved Games</Link></li>
          {auth.currentUser ? (
            <>
              <li role="none"><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
              <li role="none">
                <button className="nav__logout-btn" style={{ width: "100%" }} onClick={handleSignOut}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li role="none"><Link to="/register" className="nav__btn" onClick={closeMenu}>Login</Link></li>
          )}
          <li role="none">
            <button
              className="dark-toggle"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </li>
        </ul>
      )}
    </nav>
  )
}
