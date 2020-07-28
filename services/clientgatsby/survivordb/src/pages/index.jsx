import React from "react"
import { Link } from "gatsby"

// import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import "./mystyles.scss"

import PropTypes from "prop-types"
import { graphql } from "gatsby"
import { ThemeContext, Layout } from "../layouts"
// import Blog from "../components/Blog"
import Hero from "../components/Hero"
import Seo from "../components/SEO"

class IndexPage extends React.Component {
  separator = React.createRef()

  scrollToContent = e => {
    this.separator.current.scrollIntoView({
      block: "start",
      behavior: "smooth"
    })
  }

  render() {
    console.log(this.props)
    const {
      data: {
        bgDesktop: {
          resize: { src: desktop }
        },
        bgTablet: {
          resize: { src: tablet }
        },
        bgMobile: {
          resize: { src: mobile }
        }
      }
    } = this.props

    const backgrounds = {
      desktop,
      tablet,
      mobile
    }

    return (
      <React.Fragment>
        <ThemeContext.Consumer>
          {theme => (
            <Hero
              scrollToContent={this.scrollToContent}
              backgrounds={backgrounds}
              theme={theme}
            />
          )}
        </ThemeContext.Consumer>

        <hr ref={this.separator} />

        <style jsx>{`
          hr {
            margin: 0;
            border: 0;
          }
        `}</style>
      </React.Fragment>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.object.isRequired
}

export const query = graphql`
  query IndexQuery {
    bgDesktop: imageSharp(fluid: { originalName: { regex: "/island/" } }) {
      resize(width: 1200, quality: 90, cropFocus: CENTER) {
        src
      }
    }
    bgTablet: imageSharp(fluid: { originalName: { regex: "/island/" } }) {
      resize(width: 800, height: 1100, quality: 90, cropFocus: CENTER) {
        src
      }
    }
    bgMobile: imageSharp(fluid: { originalName: { regex: "/island/" } }) {
      resize(width: 450, height: 850, quality: 90, cropFocus: CENTER) {
        src
      }
    }
  }
`

// const IndexPage = () => (
//   <Layout>
//     <SEO title="Home" />
//     <div align="center">
//       <h1
//         className="title is-1"
//         style={{
//           fontFamily: "Survivants",
//           color: "#74c7e3",
//           fontSize: "200px",
//           textShadow: "#000 0px 0px 10px",
//         }}
//       >
//         Survivor.DB
//       </h1>
//       <h2 className="title is-3" style={{ color: "white" }}>
//         Under construction
//       </h2>
//       <hr />
//       <br />
//       <p style={{ color: "white" }}>
//         A database for all things survivor. Spoilers ahead.
//       </p>
//     </div>
//     )} />
//   </Layout>
// )

export default IndexPage
