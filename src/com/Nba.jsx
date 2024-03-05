import React from "react";

const Nav = () => {
  return (
    <React.Fragment>
 

      <header>
        <div class="container">
          <div class="logo">
            <img src="./img/logo.png" alt="Logo" />

          </div>

          <div class="links">
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Testimonials</a></li>
              <li><a href="#" class="btn">Sign up</a></li>
            </ul>
          </div>

          <div class="overlay"></div>

          <div class="hamburger-menu">
            <div class="bar"></div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Nav;
