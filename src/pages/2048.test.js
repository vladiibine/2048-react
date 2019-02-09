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
  });


  it("handles 3 number 2s in a line", () => {
    let nums = [new NumberState(
      2, 2, 1, 2, 2, 2, false, false
    ),
    new NumberState(
      2,2,2,2,2,2,false,false
    ),
    new NumberState(
      2,2,3,2,2,2,false,false
    )];

    manager.executeBoardMove(nums, -1, 0);


    let elemsWithValue4 = [];
    for (let elem of nums){
      if (elem.value === 4){
        elemsWithValue4.push(elem);
      }
    }

    let disappearingElements = [];
    for (let elem of nums){
      if (elem.disappearing){
        disappearingElements.push(elem);
      }
    }

    expect(disappearingElements.length).toBe(1);
    expect(disappearingElements[0].value).toBe(2);

    expect(elemsWithValue4.length).toBe(1);
    expect(elemsWithValue4[0].disappearing).toBe(false);


  });

  it("4240 + left =>  0424", () => {
    let nums = [new NumberState(
      2, 2, 0, 0, 2, 4, false, false
    ),
    new NumberState(
      2,2,1,0,2,2,false,false
    ),
    new NumberState(
      2,2,2,0,2,4,false,false
    )];

    manager.executeBoardMove(nums, 1, 0);

    expect(nums[0].value).toBe(4);
    expect(nums[0].disappearing).toBe(false);
    expect(nums[1].value).toBe(2);
    expect(nums[1].disappearing).toBe(false);
    expect(nums[2].value).toBe(4);
    expect(nums[2].disappearing).toBe(false);

  })
});

describe("BoardManager.executeBoardMove -> bumping into other elements", () => {
  it("converts 2204 to 0044", () => {
    let nums = [
      new NumberState(
        2, 2, 0, 0, 2, 2, false, false
      ),
      new NumberState(
        2, 2, 1, 0, 2, 2, false, false
      ),
      new NumberState(
        2, 2, 3, 0, 66, 4, false, false
      )];

    manager.executeBoardMove(nums, 1, 0);

    let otherElems = [];
    let elemsWithVal4 = [];
    for (let elem of nums) {
      if (elem.value === 4) {
        elemsWithVal4.push(elem);
      } else {
        otherElems.push(elem)
      }
    }

    expect(otherElems.length).toBe(1); // one 2, left for cleanup
    expect(otherElems[0].value).toBe(2); // one 2, left for cleanup
    expect(otherElems[0].disappearing).toBe(true); // one 2, left for cleanup


    expect(elemsWithVal4.length).toBe(2);
    expect(elemsWithVal4[0].oldValue).toBe(2);
    expect(elemsWithVal4[0].value).toBe(4);
    expect(elemsWithVal4[0].disappearing).toBe(false);

    expect(elemsWithVal4[1].oldValue).toBe(66);
    expect(elemsWithVal4[1].value).toBe(4);
    expect(elemsWithVal4[1].disappearing).toBe(false);


  });



});

describe("BoardManager.isElemInSight", () => {
  it("handles 2002+left ok", () => {
    let nums = [
      new NumberState(
        2, 2, 0, 0, 2, 4, false, false
      ),
      new NumberState(
        2, 2, 3, 0, 2, 4, false, false
      )];

    let nums2d = manager.createCurrent2DBoard(nums);

    let result = manager.isElemInSight(0, 0, 3, 0, nums2d);

    expect(result).toBe(true);
  });

  it("handles 0202+left ok", () => {
    let nums = [
      new NumberState(
        2, 2, 1, 0, 2, 4, false, false
      ),
      new NumberState(
        2, 2, 3, 0, 2, 4, false, false
      )];

    let nums2d = manager.createCurrent2DBoard(nums);

    let result = manager.isElemInSight(1, 0, 3, 0, nums2d);

    expect(result).toBe(true);
  });


  it("handles 0022+left ok", () => {
    let nums = [
      new NumberState(
        2, 2, 2, 0, 2, 4, false, false
      ),
      new NumberState(
        2, 2, 3, 0, 2, 4, false, false
      )];

    let nums2d = manager.createCurrent2DBoard(nums);


    let result = manager.isElemInSight(2, 0, 3, 0, nums2d);

    expect(result).toBe(true);
  });

  it("handles 0424+up ok (not in sight)", () => {
    let nums = [
      new NumberState(
        2, 2, 1, 0, 2, 4, false, false
      ),
      new NumberState(
        2, 2, 2, 0, 2, 2, false, false
      ),
      new NumberState(
        2, 2, 3, 0, 2, 4, false, false
      )];

    let nums2d = manager.createCurrent2DBoard(nums);

    let result = manager.isElemInSight(1, 0, 3, 0, nums2d);

    expect(result).toBe(false);
  });
});