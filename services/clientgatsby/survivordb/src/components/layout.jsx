/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery2 {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <img
        src="https://parade.com/wp-content/uploads/2020/01/Survivor-40-Cast.jpg"
        alt="bg"
        style={{
          height: "auto",
          width: "100%",
          position: "fixed",
          zIndex: -1
        }}
      />
      <div
        style={{
          margin: `0 auto`,
          padding: `10rem 1.0875rem 1.45rem`
        }}
      >
        <main>{children}</main>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
