import React from "react"
import "./mystyles.scss"

import PropTypes from "prop-types"
import { graphql } from "gatsby"
import { ThemeContext, Layout } from "../layouts"
import Hero from "../components/Hero"
import Seo from "../components/SEO"
import FeatureCard from "../components/Feature/featureCard"
import FeatureContainer from "../components/Feature/featureContainer"

class IndexPage extends React.Component {
  separator = React.createRef()

  scrollToContent = e => {
    this.separator.current.scrollIntoView({
      block: "start",
      behavior: "smooth"
    })
  }

  render() {
    return (
      <React.Fragment>
        <ThemeContext.Consumer>
          {theme => (
            <Hero
              scrollToContent={this.scrollToContent}
              backgrounds={theme.backgrounds}
              theme={theme.theme}
            />
          )}
        </ThemeContext.Consumer>

        <hr ref={this.separator} />

        <FeatureContainer />
      </React.Fragment>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.object.isRequired
}

export default IndexPage
