let config

try {
  config = require(`./config`)
} catch (e) {
  config = {
    production: {
      apiUrl: process.env.GHOST_API_URL,
      contentApiKey: process.env.GHOST_CONTENT_API_KEY
    }
  }
} finally {
  const { apiUrl, contentApiKey } =
    process.env.NODE_ENV === `development`
      ? config.development
      : config.production

  if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
    throw new Error(
      `GHOST_API_URL and GHOST_CONTENT_API_KEY are required to build. Check the README.`
    ) // eslint-disable-line
  }
}

if (
  process.env.NODE_ENV === `production` &&
  config.siteUrl === `http://localhost:8000` &&
  !process.env.SITEURL
) {
  throw new Error(
    `siteUrl can't be localhost and needs to be configured in siteConfig. Check the README.`
  ) // eslint-disable-line
}

module.exports = {
  siteMetadata: {
    title: `SurvivorDB`,
    description: `A Database for all things Survivor. Created by fans for fans`,
    author: `@porter614`
  },
  plugins: [
    `gatsby-plugin-styled-jsx`, // the plugin's code is inserted directly to gatsby-node.js and gatsby-ssr.js files
    // `gatsby-plugin-styled-jsx-postcss`, // as above
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-plugin-sharp`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              backgroundColor: "transparent"
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 2em`
            }
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: "gatsby-remark-emojis",
            options: {
              // Deactivate the plugin globally (default: true)
              active: true,
              // Add a custom css class
              class: "emoji-icon",
              // Select the size (available size: 16, 24, 32, 64)
              size: 64,
              // Add custom styles
              styles: {
                display: "inline",
                margin: "0",
                "margin-top": "1px",
                position: "relative",
                top: "5px",
                width: "25px"
              }
            }
          }
        ]
      }
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.jpg` // This path is relative to the root of the site.
      }
    }, // To learn more, visit: https://gatsby.dev/offline // this (optional) plugin enables Progressive Web App + Offline functionality
    // `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-postcss`
  ]
}
