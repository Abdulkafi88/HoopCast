import React, {useState} from 'react'
import Logo from "../assets/logo (1).png" 
import {Link} from 'react-router-dom'
const Nav = () => {
     const [dark, setDark] = useState(false)
     const [menuActive, setMenuActive] = useState(false)

     const toggleAnimation = () => {
       setDark((prevDark) => !prevDark)
     }

     const hamburgerClick = () => {
       setMenuActive((prevMenuActive) => !prevMenuActive)
     }
  return (
    <main>
      <header>
        <div className="container">
          <div className="logo">
            <img src={Logo} alt="Logo" />
          </div>

          <div className={`links ${menuActive ? "active" : ""}`}>
            <ul>
              <li>
                <Link to={"Teams"}>Teams</Link>
              </li>
              <li>
                <a href="#">SaveTeams</a>
              </li>
              <li>
                <Link to={'Home'} >Home</Link>
              </li>
              <li>
                <a href="#" className="btn">
                  Sign up
                </a>
              </li>
            </ul>
          </div>

          <div
            className={`overlay ${menuActive ? "active" : ""}`}
            onClick={hamburgerClick}
          ></div>

          <div className="hamburger-menu" onClick={hamburgerClick}>
            <div className="bar"></div>
          </div>
        </div>
      </header>
    </main>
  )
}

export default Nav