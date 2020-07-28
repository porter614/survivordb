import "typeface-open-sans"
import FontFaceObserver from "fontfaceobserver"
import PropTypes from "prop-types"
import React from "react"
import { graphql, StaticQuery } from "gatsby"

import Header from "../components/Header/"
import themeObjectFromYaml from "../theme/theme.yaml"
import "./style.css"

export const ThemeContext = React.createContext(null)
export const ScreenWidthContext = React.createContext(0)
export const FontLoadedContext = React.createContext(false)

function getScreenWidth() {
  if (typeof window !== `undefined`) {
    return window.innerWidth
  }
}

function timeoutThrottlerHandler(timeouts, name, delay, handler) {
  if (!timeouts[name]) {
    timeouts[name] = setTimeout(() => {
      timeouts[name] = null
      handler()
    }, delay)
  }
}

class Layout extends React.Component {
  constructor() {
    super()

    this.state = {
      font400loaded: false,
      font600loaded: false,
      screenWidth: 0,
      headerMinimized: false,
      theme: themeObjectFromYaml
    }

    if (typeof window !== `undefined`) {
      this.loadFont("font400", "Open Sans", 400)
      this.loadFont("font600", "Open Sans", 600)
    }
  }

  timeouts = {}

  componentDidMount() {
    this.setState({
      screenWidth: getScreenWidth()
    })
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.resizeThrottler, false)
    }
  }

  resizeThrottler = () => {
    return timeoutThrottlerHandler(
      this.timeouts,
      "resize",
      100,
      this.resizeHandler
    )
  }

  resizeHandler = () => {
    this.setState({ screenWidth: getScreenWidth() })
  }

  isHomePage = () => {
    if (this.props.location.pathname === "/") {
      return true
    }

    return false
  }

  loadFont = (name, family, weight) => {
    const font = new FontFaceObserver(family, {
      weight: weight
    })

    font.load(null, 10000).then(
      () => {
        console.log(`${name} is available`)
        this.setState({ [`${name}loaded`]: true })
      },
      () => {
        console.log(`${name} is not available`)
      }
    )
  }

  render() {
    return (
      <StaticQuery
        query={graphql`
          query LayoutQuery {
            site {
              id
            }
          }
        `}
        render={data => {
          const { children } = this.props

          return (
            <ThemeContext.Provider value={this.state.theme}>
              <FontLoadedContext.Provider value={this.state.font400loaded}>
                <ScreenWidthContext.Provider value={this.state.screenWidth}>
                  <React.Fragment>
                    <Header
                      path={this.props.location.pathname}
                      theme={this.state.theme}
                    />
                    <main>{children}</main>

                    {/* --- STYLES --- */}
                    <style jsx>{`
                      main {
                        min-height: 800vh;
                      }
                    `}</style>
                  </React.Fragment>
                </ScreenWidthContext.Provider>
              </FontLoadedContext.Provider>
            </ThemeContext.Provider>
          )
        }}
      />
    )
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default Layout
