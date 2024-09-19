import React, { useState } from 'react'
import Logo from "../assets/logo (1).png"
import { Link } from 'react-router-dom'
import '../App.css'
import { auth } from "../Firebase"
import { signOut } from "firebase/auth"
const Nav = ({ user }) => {
  const handleSignOut = async () => {
    await signOut(auth)
  }
  return (
    <nav>
      <div class="nav__logo"><Link to={'Home'}>Live Nba Scores</Link></div>
      <ul class="nav__links">
        <li class="link"><Link to={'Home'}>Home</Link></li>
        <li class="link"><Link to={'Teams'}>Teams</Link></li>
        <li class="link"><Link to={'Savegames'}>Save Games</Link></li>
        <li class="link"><Link to="#" onClick={handleSignOut}>{user ? <span>{user.email}</span> : ''}</Link></li>
        {
          auth.currentUser ?
            <button style={{ backgroundColor: 'red' }} onClick={handleSignOut}>Logout</button> :
            <li class="link"><Link to={'Register'} class="nav__btn">Register</Link></li>
        }
      </ul>
    </nav>
  )
}

export default Nav