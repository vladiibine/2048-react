// Why this file? Check out the link
// https://www.gatsbyjs.org/docs/unit-testing/
// Find out more about how to test, how to run the tests in code-watch mode, etc by visiting
// the link
import React from "react"

import {BoardManager, NumberState} from "./2048";

let manager = new BoardManager();  // the BoardManager is stateless

describe("BoardManager.popRandomElement", () => {
  it("pops a random elem out of an array", () => {
    let myArray = [1, 2, 3];

    let poppedNum = manager.popRandomElement(myArray);

    expect(typeof poppedNum).toEqual('number');

    // assert set([1,2,3]) > set(myArray)
    expect([1, 2, 3]).toEqual(expect.arrayContaining(myArray));

    expect(myArray).toHaveLength(2);

    expect(myArray).not.toContain(poppedNum);
    expect([1, 2, 3]).toContain(poppedNum);
  })
});

describe('BoardManager.executeBoardMove , simple movements', () => {

  it("moves an element to the left", () => {
    let nums = [new NumberState(
      2, 2, 2, 2, 2, 2, false, false
    )];

    manager.executeBoardMove(nums, -1, 0);

    expect(nums[0].x).toEqual(0);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].y).toEqual(2);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  });

  it("moves an element to the right", () => {
    let nums = [new NumberState(
      2, 2, 2, 2, 2, 2, false, false
    )];

    manager.executeBoardMove(nums, 1, 0);

    expect(nums[0].x).toEqual(3);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].y).toEqual(2);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  });

  it("moves an element up", () => {
    let nums = [new NumberState(
      2, 2, 2, 2, 2, 2, false, false
    )];

    manager.executeBoardMove(nums, 0, -1);

    expect(nums[0].x).toEqual(2);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].y).toEqual(0);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  });

  it("moves an element down", () => {
    let nums = [new NumberState(
      2, 2, 2, 2, 2, 2, false, false
    )];

    manager.executeBoardMove(nums, 0, 1);

    expect(nums[0].x).toEqual(2);
    expect(nums[0].oldX).toEqual(2);

    expect(nums[0].y).toEqual(3);
    expect(nums[0].oldY).toEqual(2);

    expect(nums).toHaveLength(1);
  })
});


describe("BoardManager.executeBoardMove -> merging of elements", () => {
  it("merges 2 number 2s", () => {
    let nums = [new NumberState(
      2, 2, 1, 2, 2, 2, false, false
    ),
    new NumberState(
      2,2,2,2,2,2,false,false
    )];

    manager.executeBoardMove(nums, -1, 0);

    expect(nums[0].x).toEqual(0);
    expect(nums[0].y).toEqual(2);
    expect(nums[0].oldX).toEqual(1);
    expect(nums[0].oldY).toEqual(2);

    expect(nums[1].x).toEqual(0);
    expect(nums[1].y).toEqual(2);
    expect(nums[1].oldX).toEqual(2);
    expect(nums[1].oldY).toEqual(2);
  })
});

describe("BoardManager.executeBoardMove -> bumping into other elements", () => {

});