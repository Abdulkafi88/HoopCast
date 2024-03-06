import React from "react";
import img1 from '../assets/nikola.png'
import pg13 from '../assets/pg13new.jpg'
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <section class="container">
      <div class="content__container">
        <h1>
          Love Basketball?
          <br />
          <span class="heading__1">Stay in the Game</span>
          <br />
          <span class="heading__2">with Our Latest NBA News Updates! 🏀🔥</span>
        </h1>
        <p>
          Dunk into the Action: Your Daily Slam of NBA Thrills, Sizzling Trades,
          and Unstoppable Triumphs! Elevate your Hoops IQ with our Exclusive
          Insights, Player Spotlights, and Behind-the-Scenes Buzz. Don't just
          follow the game, immerse yourself in it! 🏀🔥
        </p>
        <form>
      
          <button type="submit"><Link to={'/Teams'}>Teams</Link></button>
        </form>
      </div>
      <div class="image__container">
        <img src={img1} alt="header" />
        <img src={pg13} alt="header" />
        <div class="image__content">
          <ul>
            <li>Daily NBA Scoop! 🏀📰</li>
            <li>Your Quick Fix for NBA News! 🏀🚀 </li>
          </ul>
        </div>
      </div>
    </section>
  )
};

export default Home;
