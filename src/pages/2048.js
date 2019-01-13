import React from 'react'
import {Link} from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'


class Number extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const {posX, posY, number} = this.props;

    return (
      <div className={`position-${posX}-${posY}`}>{number}</div>
    )
  }
}


class Page2048 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nums: []
    };

    this.spawnNums();
  }

  /**
   * This entire function and everything it uses is deprecated and wrong
   */
  spawnNums() {
    let spawnablePlaces = [];
    for (let level1ArrayIdx = 0; level1ArrayIdx < this.state.nums.length; level1ArrayIdx++) {
      for (let elemIdx = 0; elemIdx < this.state.nums[level1ArrayIdx].length; elemIdx++) {
        if (this.state.nums[level1ArrayIdx][elemIdx] === null){
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
      elementsToSpawn.push(this.popRandomElement(spawnablePlaces))
    }

    let newState = [
      [...this.state[0]],
      [...this.state[1]],
      [...this.state[2]],
      [...this.state[3]],
    ];
    for (let elementToSpawn of elementsToSpawn){
      newState[elementToSpawn[0]][elementToSpawn[1]] = 2;
    }

    this.setState({nums: newState});

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
          <div className="grid-row">
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
          </div>
          <div className="grid-row">
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
          </div>
          <div className="grid-row">
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
          </div>
          <div className="grid-row">
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
            <div className="grid-elem"></div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Page2048
