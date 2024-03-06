import React from "react";
import img1 from '../assets/nikola.png'
import pg13 from '../assets/pg13new.jpg'
const Home = () => {
  return (
    <section class="container">
      <div class="content__container">
        <h1>
          Best Learning
          <br />
          <span class="heading__1">Education Platform</span>
          <br />
          <span class="heading__2">in The World</span>
        </h1>
        <p>
          Unlock your full learning potential with our intuitive education
          platform. Seamlessly blending technology and education, we provide an
          immersive learning environment that combines interactive lessons,
          virtual classrooms, and intelligent feedback.
        </p>
        <form>
          <input type="text" placeholder="What do you want to learn" />
          <button type="submit">Search Course</button>
        </form>
      </div>
      <div class="image__container">
        <img src={img1} alt="header" />
        <img src={pg13} alt="header" />
        <div class="image__content">
          <ul>
            <li>Get 30% off on every 1st month</li>
            <li>Expert teachers</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Home;
