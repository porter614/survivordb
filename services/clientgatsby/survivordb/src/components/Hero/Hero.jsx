import React from "react"
import PropTypes from "prop-types"

import { FaArrowDown } from "react-icons/fa/"
import "./style.css"

const Hero = props => {
  const { scrollToContent, backgrounds, theme } = props

  return (
    <React.Fragment>
      <section className="hero">
        <h1
          style={{
            fontFamily: "Survivants",
            fontSize: "8vw",
            textAlign: "center",
            color: "#ffffff",
            lineHeight: 1.1,
            textRemoveGap: 'both 0 "Open Sans"',
            textShadow: "#000 0px 0px 20px"
          }}
        >
          Survivor<strong>DB</strong>
        </h1>
        <h2
          style={{
            fontFamily: "Survivants",
            fontSize: "1vw",
            fontStyle: "italic",
            color: "#CFCFCE",
            textShadow: "#000 0px 0px 20px",
            paddingBottom: "1vw"
          }}
        >
          A database for all things Survivor
        </h2>
        <button
          onClick={scrollToContent}
          aria-label="scroll"
          className="heroButton"
        >
          <FaArrowDown />
        </button>
      </section>

      {/* --- STYLES --- */}
      <style jsx>{`
        .hero {
          align-items: center;
          background: ${theme.hero.background};
          background-image: url(${backgrounds.desktop});
          background-size: cover;
          color: ${theme.text.color.primary.inverse};
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          min-height: 100vh;
          height: 100px;
          padding: ${theme.space.inset.l};
          padding-top: ${theme.header.height.homepage};
        }
      `}</style>
    </React.Fragment>
  )
}

Hero.propTypes = {
  scrollToContent: PropTypes.func.isRequired,
  backgrounds: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default Hero
