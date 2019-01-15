import React from 'react'
import {Link} from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'


class Number extends React.Component {
  render(){
    const {posX, posY, number} = this.props;

    return (
      <div className={`position-${posX}-${posY}`}>{number}</div>
    )
  }

  moveTo(posX, posY){

  }

  times2(){

  }

}

/**
 * Function that will always return a unique integer
 * (depends of course on whether you call it enough times... cuz at some point, it overflows)
 */
const generateId = (() => {
  let currentId = 0;

  return () => {
    currentId++;
    return currentId;
  }
})();


class Page2048 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nums: this.generateSpawnableNums([]),  //will contain {id:<ID>, posX: <int>, posY: <int>}
    };
  }

  /**
   * returns an array with 1-2 elems like {id:<int>, posX: <int>, posY: <int>}
   * If no numbers can be generated, the game ends
   */
  generateSpawnableNums(currentNums) {
    let positionMatrix = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    for (let currentNum of currentNums){
      positionMatrix[currentNum.posX][currentNum.posY] = true; // anything that !== null, is fine
    }

    let spawnablePlaces = [];
    for (let level1ArrayIdx = 0; level1ArrayIdx < positionMatrix.length; level1ArrayIdx++) {
      for (let elemIdx = 0; elemIdx < positionMatrix[level1ArrayIdx].length; elemIdx++) {
        if (positionMatrix[level1ArrayIdx][elemIdx] === null){
          spawnablePlaces.push([level1ArrayIdx, elemIdx]);
        }
      }
    }

    let numSpawns = 2;
    if (Math.random() < 0.5){
      numSpawns = 1;
    }

    let elementsToSpawn = [];
    for (let i = 0; i < numSpawns; i++) {
      let spawnableElement = this.popRandomElement(spawnablePlaces);
      elementsToSpawn.push(
        {
          id: generateId(),
          posX: spawnableElement[0],
          posY: spawnableElement[1]
        })
    }

    return elementsToSpawn
  }

  /**
   * Pick a random array element, and return it, while also removing it from the array
   * @param array
   * @returns {T}
   */
  popRandomElement(array) {
    return array.splice(Math.random() * array.length | 0, 1)[0];
  }

  render() {
    return (
      <Layout>
        <SEO title="2048"/>
        <h1>2048!</h1>
        <Link to="/">Go back to the homepage</Link>
        <div className="grid-container">

          {/*<div className="grid-row">*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
          {/*</div>*/}
          {/*<div className="grid-row">*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
          {/*</div>*/}
          {/*<div className="grid-row">*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
          {/*</div>*/}
          {/*<div className="grid-row">*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
            {/*<div className="grid-elem"></div>*/}
          {/*</div>*/}
        </div>
      </Layout>
    );
  }
}

export default Page2048
