/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
// const path = require(`path`)

// // // You can delete this file if you're not using it
// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions
//   const queryResults = await graphql(`
//     query AllProducts {
//       allProducts {
//         nodes {
//           id
//           name
//           price
//           description
//         }
//       }
//     }
//   `)

//   const productTemplate = path.resolve(`src/components/ContestantProfile.jsx`)
//   queryResults.data.allProducts.nodes.forEach(contestant => {
//     createPage({
//       path: `/contestants/${contestant.id}`,
//       component: productTemplate,
//       context: {
//         // This time the entire product is passed down as context
//         product: contestant,
//       },
//     })
//   })
// }
