// Why this file?
// https://www.gatsbyjs.org/docs/unit-testing/
// Vlad: This sets up mocks for `gatsby.graphql`, `gatsby.Link` and `.StaticQuery` objects.
// Maybe we don't need this, but let's leave it here as an example.


const React = require("react");
const gatsby = jest.requireActual("gatsby");

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ to, ...rest }) =>
    React.createElement("a", {
      ...rest,
      href: to,
    })
  ),
  StaticQuery: jest.fn(),
};