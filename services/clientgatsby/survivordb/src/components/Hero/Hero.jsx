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
            paddingBottom: "1vw",
            textAlign: "center",
            margin: "0 0 40px 0",
            color: "#ffffff",
            lineHeight: 1.1,
            textRemoveGap: 'both 0 "Open Sans"',
            textShadow: "#000 0px 0px 20px"
          }}
        >
          Survivor<strong>DB</strong>
        </h1>
        <button onClick={scrollToContent} aria-label="scroll">
          <FaArrowDown />
        </button>
      </section>

      {/* --- STYLES --- */}
      <style jsx>{`
        .hero {
          align-items: center;
          background: ${theme.hero.background};
          background-image: url(${backgrounds.desktop});
          background-size: 100% auto;
          background-position: fixed;
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
