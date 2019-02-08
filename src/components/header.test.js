// Why this file? Check out the link
// https://www.gatsbyjs.org/docs/unit-testing/
// Find out more about how to test, how to run the tests in code-watch mode, etc by visiting
// the link
import React from "react"
import renderer from "react-test-renderer"

import Header from "../components/header"

describe("Header", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<Header siteTitle="Default Starter"/>)
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
});