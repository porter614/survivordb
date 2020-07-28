import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import VisibilitySensor from "react-visibility-sensor"

import { ScreenWidthContext, FontLoadedContext } from "../../layouts"
import config from "../../../content/meta/config"
import Menu from "../Menu"

import avatar from "../../images/jpg/twitter.jpg"
import "./style.css"

class Header extends React.Component {
  state = {
    fixed: false
  }

  visibilitySensorChange = val => {
    if (val) {
      this.setState({ fixed: false })
    } else {
      this.setState({ fixed: true })
    }
  }

  getHeaderSize = () => {
    const fixed = this.state.fixed ? "fixed" : ""
    const homepage = this.props.path === "/" ? "homepage" : ""

    return `${fixed} ${homepage}`
  }

  render() {
    const { path, theme } = this.props
    const { fixed } = this.state

    return (
      <React.Fragment>
        <header className={`header ${this.getHeaderSize()}`}>
          <Link to="/" className="logoType">
            <div className="logo">
              <img
                src={
                  config.gravatarImgMd5 == "" ? avatar : config.gravatarImgMd5
                }
                alt={config.siteTitle}
              />
            </div>
            <div className="type">
              <h1>{config.headerTitle}</h1>
              <h2>{config.headerSubTitle}</h2>
            </div>
          </Link>
          <FontLoadedContext.Consumer>
            {loaded => (
              <ScreenWidthContext.Consumer>
                {width => (
                  <Menu
                    path={path}
                    fixed={fixed}
                    screenWidth={width}
                    fontLoaded={loaded}
                    theme={theme}
                  />
                )}
              </ScreenWidthContext.Consumer>
            )}
          </FontLoadedContext.Consumer>
        </header>
        <VisibilitySensor onChange={this.visibilitySensorChange}>
          <div className="sensor" />
        </VisibilitySensor>
      </React.Fragment>
    )
  }
}

Header.propTypes = {
  path: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
}

export default Header
