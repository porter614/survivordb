import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

import "./NavBar.css"; // new

const titleStyle = {
  fontWeight: "bold",
};

const NavBar = (props) => {
  let menu = (
    <div className="navbar-menu">
      <div className="navbar-start">
        <Link to="/seasons" className="navbar-item" data-testid="nav-about">
          Seasons
        </Link>
        <Link to="/players" className="navbar-item" data-testid="nav-about">
          Players
        </Link>
        <Link
          to="/contestant/1?against=2"
          className="navbar-item"
          data-testid="nav-about"
        >
          Versus
        </Link>
        <Link to="/graph" className="navbar-item" data-testid="nav-about">
          Graph
        </Link>
      </div>
    </div>
  );

  return (
    <nav
      className="navbar is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <section className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item nav-title" style={titleStyle}>
            {props.title}
          </Link>
          <span
            className="nav-toggle navbar-burger"
            onClick={() => {
              let toggle = document.querySelector(".nav-toggle");
              let menu = document.querySelector(".navbar-menu");
              toggle.classList.toggle("is-active");
              menu.classList.toggle("is-active");
            }}
          >
            <span />
            <span />
            <span />
          </span>
        </div>
        {menu}
      </section>
    </nav>
  );
};

NavBar.propTypes = {
  title: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default NavBar;
