import React, {useState} from 'react'
import Logo from "../assets/logo (1).png" 
import {Link} from 'react-router-dom'
import '../App.css'
const Nav = () => {
    
  return (
    <nav>
    <div class="nav__logo"><a href="#">Logo</a></div>
    <ul class="nav__links">
      <li class="link"><Link to={'Home'}>Home</Link></li>
      <li class="link"><Link to={'Teams'}>Teams</Link></li>
      <li class="link"><Link to="#">Save Games</Link></li>
      <li class="link"><Link to={'Register'} class="nav__btn">Register</Link></li>
    </ul>
  </nav>
  )
}

export default Nav