// Why this file? Check out the link
// https://www.gatsbyjs.org/docs/unit-testing/
// Find out more about how to test, how to run the tests in code-watch mode, etc by visiting
// the link
import React from "react"
import renderer from "react-test-renderer"

import Header from "../components/header"
import {BoardManager, NumberState} from "./2048";

describe("Header", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<Header siteTitle="Default Starter"/>)
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
});

describe("BoardManager.popRandomElement", () => {
  it("pops a random elem out of an array", () => {
    let myArray = [1, 2, 3];
    let manager = new BoardManager();

    let poppedNum = manager.popRandomElement(myArray);
    console.log(poppedNum);

    expect(typeof poppedNum).toEqual('number');

    // assert set([1,2,3]) > set(myArray)
    expect([1, 2, 3]).toEqual(expect.arrayContaining(myArray));

    expect(myArray).toHaveLength(2);

    expect(myArray).not.toContain(poppedNum);
    expect([1, 2, 3]).toContain(poppedNum);
  })
});

describe('BoardManager.executeBoardMove , simple movements', () => {
  let manager = new BoardManager();

  it("moves an element to the left", () => {
    let nums = [new NumberState(
      2,2,2,2,2,2,false,false
    )];

    manager.executeBoardMove(nums, -1, 0);

    expect(nums[0].newX).toEqual(0);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].newY).toEqual(2);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  });

  it("moves an element to the right", () => {
    let nums = [new NumberState(
      2,2,2,2,2,2,false,false
    )];

    manager.executeBoardMove(nums, 1, 0);

    expect(nums[0].newX).toEqual(3);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].newY).toEqual(2);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  });

  it("moves an element up", () => {
    let nums = [new NumberState(
      2,2,2,2,2,2,false,false
    )];

    manager.executeBoardMove(nums, 0, -1);

    expect(nums[0].newX).toEqual(2);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].newY).toEqual(0);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  });

  it("moves an element down", () => {
    let nums = [new NumberState(
      2,2,2,2,2,2,false,false
    )];

    manager.executeBoardMove(nums, 0, 1);

    expect(nums[0].newX).toEqual(2);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].newY).toEqual(3);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  })
});
