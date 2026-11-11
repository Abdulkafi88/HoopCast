import React, { useState, useRef, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import "../App.css"
import { auth } from "../Firebase"
import { signOut } from "firebase/auth"
import GlobalSearch from "./GlobalSearch"
import { BallIcon, UserIcon, HomeIcon, CalendarIcon, ChartIcon, BookmarkIcon, ChevronDownIcon, CompareIcon } from "./Icons"

const MAIN_LINKS = [
  { to: "/teams", label: "Games" },
  { to: "/standings", label: "Standings" },
  { to: "/players", label: "Players" },
  { to: "/compare", label: "Compare" },
]

const TAB_LINKS = [
  { to: "/home", label: "Home", Icon: HomeIcon },
  { to: "/teams", label: "Games", Icon: CalendarIcon },
  { to: "/standings", label: "Standings", Icon: ChartIcon },
  { to: "/compare", label: "Compare", Icon: CompareIcon },
  { to: "/savegames", label: "Saved", Icon: BookmarkIcon },
]

export default function Nav({ user }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const handleSignOut = async () => {
    await signOut(auth)
    setMenuOpen(false)
    navigate("/home")
  }

  const linkClass = ({ isActive }) => `hc-nav__link${isActive ? " is-active" : ""}`

  return (
    <>
      <header className="hc-nav" role="banner">
        <div className="hc-nav__inner">
          <Link to="/home" className="hc-nav__logo" aria-label="HoopCast home">
            <BallIcon size={26} className="hc-nav__ball" />
            <span>HOOPCAST</span>
          </Link>

          <nav className="hc-nav__links" aria-label="Main navigation">
            {MAIN_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
            ))}
          </nav>

          <div className="hc-nav__right">
            <div className="hc-nav__search">
              <GlobalSearch />
            </div>

            {user ? (
              <div className="hc-account" ref={menuRef}>
                <button
                  type="button"
                  className="hc-account__btn"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                >
                  <UserIcon size={18} />
                  <ChevronDownIcon size={14} className="hc-account__chev" />
                </button>
                {menuOpen && (
                  <div className="hc-account__menu" role="menu">
                    <p className="hc-account__email">{user.email}</p>
                    <Link role="menuitem" to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                    <Link role="menuitem" to="/savegames" onClick={() => setMenuOpen(false)}>Saved games</Link>
                    <button role="menuitem" type="button" onClick={handleSignOut}>Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" className="hc-btn hc-btn--primary hc-nav__signin">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom tab bar on phones */}
      <nav className="hc-tabbar" aria-label="Main navigation">
        {TAB_LINKS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `hc-tabbar__item${isActive ? " is-active" : ""}`}>
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
