/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

require('dotenv').config()
const fetch = require("isomorphic-fetch")
const { createHttpLink } = require("apollo-link-http")


module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "hasura",
        fieldName: "blog",
        createLink: pluginOptions => {
          return createHttpLink({
            uri: "https://hasura-gatsby.herokuapp.com/v1/graphql",
            headers: {
              "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
            },
            fetch,
          })
        },
      },
    },
  ],
}
