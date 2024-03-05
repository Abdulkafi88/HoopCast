import React, { useState } from 'react';
import shape from '../assets/shape.png' 
import person from '../assets/person.png' 
import Logo from '../assets/logo (1).png' 

const Home = () => {
  const [dark, setDark] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  const toggleAnimation = () => {
    setDark((prevDark) => !prevDark);
  };

  const hamburgerClick = () => {
    setMenuActive((prevMenuActive) => !prevMenuActive);
  };

  return (
    <main>
      <div className={`big-wrapper ${dark ? 'dark' : 'light'} ${menuActive ? 'active' : ''}`}>
        <img src={shape} alt="" className="shape" />

        <header>
          <div className="container">
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>

            <div className={`links ${menuActive ? 'active' : ''}`}>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Testimonials</a></li>
                <li><a href="#" className="btn">Sign up</a></li>
              </ul>
            </div>

            <div className={`overlay ${menuActive ? 'active' : ''}`} onClick={hamburgerClick}></div>

            <div className="hamburger-menu" onClick={hamburgerClick}>
              <div className="bar"></div>
            </div>
          </div>
        </header>

        <div className="showcase-area">
          <div className="container">
            <div className="left">
              <div className="big-title">
                <h1>Future is here,</h1>
                <h1>Start Exploring now.</h1>
              </div>
              <p className="text">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Delectus eius distinctio odit, magni magnam qui ex perferendis
                vitae!
              </p>
              <div className="cta">
                <a href="#" className="btn">Get started</a>
              </div>
            </div>

            <div className="right">
              <img src={person} alt="Person Image" className="person" />
            </div>
          </div>
        </div>

        <div className="bottom-area">
          <div className="container">
            <button className="toggle-btn" onClick={toggleAnimation}>
              <i className={`far  ${dark ? 'fa-moon' : 'fa-moon'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
