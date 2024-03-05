import React, { useState } from 'react';
import shape from '../assets/shape.png' 
import person from '../assets/person.png' 

import { Link } from 'react-router-dom';
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
              <i className={`far  ${dark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
