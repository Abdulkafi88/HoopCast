import React from "react";
import img1 from '../assets/nikola.png'
import pg13 from '../assets/pg-13.png'  
import { Link } from "react-router-dom"; const Home = () => {
  return (
    <section className="container">
      <div className="content__container">
        <h1>
          Love Basketball?  <br />
          <span className="heading__1">Stay in the Game</span>
          <br />
          <span className="heading__2">with Our Latest NBA News Updates! 🏀🔥</span>
        </h1>
        <p>
        Catch every slam dunk and clutch shot live!
        Our website keeps you on the edge of your seat with up-to-the-minute NBA game updates.
        Click below to dive into the excitement and stay ahead of the game🏀🔥
        </p>
        <form>
          <button className="get-info" type="submit">
            <Link to={'/Teams'}>Teams</Link>
          </button>
        </form>
      </div>
      <div className="image__container">
        <img src={img1} alt="header" />
        <img src={pg13} alt="header" /> <div className="image__content">
          <ul>
            <li>Daily NBA Games! 🏀📰</li>
            <li>Your Quick Live Scores! 🏀🚀 </li>
          </ul>
        </div>
      </div>
    </section>
  )
};

export default Home;
