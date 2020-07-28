import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = props => (
  <div style={{ paddingBottom: "80px" }}>
    <nav
      className="navbar is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <section className="container">
        <div className="navbar-brand">
          <Link
            to="/"
            className="navbar-item nav-title"
            style={props.titleStyle}
          >
            {props.siteTitle}
          </Link>
          <span
            className="nav-toggle navbar-burger"
            onClick={() => {
              let toggle = document.querySelector(".nav-toggle")
              let menu = document.querySelector(".navbar-menu")
              toggle.classList.toggle("is-active")
              menu.classList.toggle("is-active")
            }}
          >
            <span />
            <span />
            <span />
          </span>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <Link to="/seasons" className="navbar-item" data-testid="nav-about">
              Seasons
            </Link>
            <Link to="/players" className="navbar-item" data-testid="nav-about">
              Players
            </Link>
            <Link to="/versus" className="navbar-item" data-testid="nav-about">
              Versus
            </Link>
            <Link to="/graph" className="navbar-item" data-testid="nav-about">
              Graph
            </Link>
          </div>
        </div>
      </section>
    </nav>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string
}

Header.defaultProps = {
  siteTitle: ``
}

export default Header
