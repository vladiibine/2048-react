import React from 'react'
import {Link} from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

class NumberState {
  /**
   *
   * @param {number}oldX
   * @param {number}oldY
   * @param {number}newX
   * @param {number}newY
   * @param {number}oldValue
   * @param {number}newValue
   * @param {boolean}appearing
   * @param {boolean}disappearing
   */
  constructor(oldX, oldY, newX, newY, oldValue, newValue, appearing, disappearing, pair=null){
    this.oldX = oldX;
    this.oldY = oldY;
    this.newX = newX;
    this.newY = newY;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.appearing = appearing;
    this.disappearing = disappearing;
    this.pair = pair;
  }
}

class NumberCell extends React.Component {
  render(){
    const {newValue, oldX, newX, oldY, newY, oldValue, appearing} = this.props.numState;

    const className = `tile tile-${newValue} tile-position-${newX + 1}-${newY + 1} ${appearing || oldValue !== newValue? 'tile-new': ''}`;

    return <div className={className}>
             <div className="tile-inner">{newValue}</div>
           </div>
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


class BoardManager {

}


class Page2048 extends React.Component {
  constructor(props) {
    super(props);

    // 1. generateNumStates
    // 2. render
    // 3. repeat:
    // 3.1 onKeyPress
    // 3.2. if generateNumStates succeeds:
    // 3.2.1. changeCellStates(up/down/left/right)
    // 3.2.2. render
    // 3.3. ...else:
    // 3.3.1. congratulate player on the score!
    // 3.3.2. BREAK

    let boardManager = new BoardManager();
    this.state = {
      // nums: this.DEPRECATEDgenerateSpawnableNums([]),  //will contain {id:<ID>, posX: <int>, posY: <int>}
      boardManager: boardManager,
      numStateArray: this.generateNumStates(),  // {array[NumberState]}
    };

    this.reactToKeyPress = this.reactToKeyPress.bind(this);

    window.onkeydown = this.reactToKeyPress;
  }

  componentWillUnmount() {
    window.onkeydown = null;  // deregister/clean current event handler.
  }
  
  reactToKeyPress(e){
    console.log(e);
    let moveX = 0;
    let moveY = 0;

    // determine move direction;
    switch (e.keyCode) {
      case 37: {  // left
        moveX = -1;
        e.preventDefault();
        break;
      }
      case 38: {  // up
        moveY = -1;
        e.preventDefault();
        break;
      }
      case 39: { // right
        moveX = 1;
        e.preventDefault();
        break;
      }
      case 40: { //down
        moveY = 1;
        e.preventDefault();
        break;
      }
    }
    let newElems = this.triggerBoardMove(moveX, moveY, this.state.numStateArray);
    if (typeof newElems === 'undefined'){
      alert('Game done! congrats!');
      this.setState({numStateArray: this.generateNumStates()})
    }
    this.setState({numStateArray: newElems})

  }

  triggerBoardMove(moveX, moveY, numStates) {
// spawn new numbers
    let tempNewElems = [];
    let newGeneratedElems = this.generateNumStates(numStates);

    if (typeof newGeneratedElems === 'undefined'){
      return;
    }

    for (let newElem of numStates.concat(newGeneratedElems)) {
      tempNewElems.push(new NumberState(
        newElem.oldX,
        newElem.oldY,
        newElem.newX,
        newElem.newY,
        newElem.oldValue,
        newElem.newValue,
        newElem.appearing,
        newElem.disappearing,
      ))
    }

    // move numbers
    this.executeBoardMove(tempNewElems, moveX, moveY);

    // purge disappearing elements
    let newElems = [];
    for (let newElem of tempNewElems) {
      if (!newElem.disappearing) {
        newElems.push(newElem);
      }
    }
    return newElems;
  }

  /**
   *
   * @param {NumberState[]} nums
   * @param {number} incrementX - will be +-1 or 0; +-1 just show the direction, not the number of cells
   * @param {number} incrementY - will be +-1 or 0; +-1 just show the direction, not the number of cells
   */
  executeBoardMove(nums, incrementX, incrementY){
    /*
    0  0  0  2
    2  0  0  2
    4  2  2  2
    4  2  2  2

     exista "cuplaje" care se formeaza. Fiecare numar poate fi cuplat cu maxim inca 1 numar;
     numerele cuplate se muta pe aceeasi pozitie
     cel ce are in fatza numa gol, sare peste atatea goluri cate sunt
     daca un numar are in fatza un cuplaj, sare peste goluri + numar de cuplaje

     1. determinam cuplajele
     2. sarim peste goluri + cuplaje
     3. cuplantzii sar pe acelasi loc
    */
    const currentBoard = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    // set the current board
    for (let num of nums){
      currentBoard[num.oldX][num.oldY] = num;
    }

    // set the new positions, and new values
    for (let ix=0; ix<currentBoard.length; ix++){
      for(let iy=0; iy<currentBoard[ix].length; iy++){
        let currentElem = currentBoard[ix][iy];
        if(currentElem === null){
          continue;
        }
        // a b d 1

        let spyX = ix + incrementX;
        let spyY = iy + incrementY;

        let movePositions = 0;
        let hasPaired = false;
        let pairInSight = true;

        while (spyX >=0 && spyX < 4 && spyY >= 0 && spyY < 4){
          debugger;

          let spyElem = currentBoard[spyX][spyY];
          if(spyElem === null){
            movePositions++;
          } else if(spyElem.oldValue !== currentElem.oldValue){
            pairInSight = false;
          } else if(spyElem.oldValue === currentElem.oldValue && pairInSight && !hasPaired){
            movePositions++;
            hasPaired = true;
            spyElem.pair = currentElem;
            spyElem.newValue = spyElem.oldValue * 2;
            currentElem.disappearing = true;
          } else if(spyElem.pair !== null){
            movePositions++;
          }

          spyY += incrementY;
          spyX += incrementX;
        }

        currentElem.newX = currentElem.oldX + movePositions * incrementX;
        currentElem.newY = currentElem.oldY + movePositions * incrementY;
      }
    }

  }

  /**
   *
   * @param {NumberState[]} stateArray
   * @returns {Array}
   */
  generateNumStates(stateArray = []){
    let positionMatrix = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    for (let currentNum of stateArray){
      positionMatrix[currentNum.newX][currentNum.newY] = true; // anything that !== null, is fine
    }

    let spawnablePlaces = [];
    for (let xIndex = 0; xIndex < positionMatrix.length; xIndex++) {
      for (let yIndex = 0; yIndex < positionMatrix[xIndex].length; yIndex++) {
        if (positionMatrix[xIndex][yIndex] === null){
          spawnablePlaces.push([xIndex, yIndex]);
        }
      }
    }

    let numSpawns = 2;
    if (Math.random() < 0.5){
      numSpawns--;
    }

    let elementsToSpawn = [];
    for (let i = 0; i < numSpawns; i++) {
      let spawnableElement = this.popRandomElement(spawnablePlaces);
      if (spawnableElement === undefined){
        return;
        // alert("Game done! congrats for the score!");
        // this.setState({numStateArray: []})
      } else{
        elementsToSpawn.push(
          new NumberState(
            spawnableElement[0],  //oldY
            spawnableElement[1],  //oldY

            spawnableElement[0],  //newX
            spawnableElement[1],  //newY

            2,
            2,
            true,
            false,
          )
        )
      }
    }

    return elementsToSpawn;
  }

  /**
   * Pick a random array element, and return it, while also removing it from the array
   * @param array
   * @returns {T}
   */
  popRandomElement(array) {
    return array.splice(Math.random() * array.length | 0, 1)[0];
  }

  // renderNumberCells(){
  //   return this.state.numStateArray.map((numState) => <NumberCell numberState={numState} />)
  // }

  render() {
    return (
      <div>
        <SEO title="2048"/>
        {/*<h1>2048!</h1>*/}
        <Link to="/">Home</Link>
        {/*<div className="grid-container">*/}
        {/*<div className="grid-row">*/}
        {/*<div className="grid-elem pos-0-0">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-1-0">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-2-0">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-3-0">&nbsp;</div>&nbsp;*/}
        {/*</div>*/}
        {/*<div className="grid-row">*/}
        {/*<div className="grid-elem pos-0-1">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-1-1">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-2-1">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-3-1">&nbsp;</div>&nbsp;*/}
        {/*</div>*/}
        {/*<div className="grid-row">*/}
        {/*<div className="grid-elem pos-0-2">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-1-2">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-2-2">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-3-2">&nbsp;</div>&nbsp;*/}
        {/*</div>*/}
        {/*<div className="grid-row">*/}
        {/*<div className="grid-elem pos-0-3">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-1-3">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-2-3">&nbsp;</div>&nbsp;*/}
        {/*<div className="grid-elem pos-3-3">&nbsp;</div>&nbsp;*/}
        {/*</div>*/}
        {/*{this.state.numStateArray.map((numState) => <NumberCell numState={numState} />)}*/}
        {/*</div>*/}
        <div className="container">
          {/*<div className="heading">*/}
            {/*<h1 className="title"><a href="/">2048</a></h1>*/}
            {/*<div className="scores-container">*/}
              {/*<div className="score-container">3460*/}
                {/*<div className="score-addition">+3460</div>*/}
              {/*</div>*/}
              {/*<div className="best-container">3460</div>*/}
            {/*</div>*/}
          {/*</div>*/}
          {/*<div className="game-intro">*/}
            {/*<a className="restart-button">New Game</a>*/}   {/*!!!! restart button!*/}
            {/*<h2 className="subtitle">Play <strong>2048 Game</strong> Online</h2>*/}
            {/*<div className="above-game">*/}
              {/*<p>Join the numbers and get to the <strong>2048 tile!</strong></p>*/}
            {/*</div>*/}
          {/*</div>*/}

          <div className="game-container">
            <div className="game-message">
              <p></p>
              <div className="lower">
                <a className="keep-playing-button">Keep playing</a>
                <a className="retry-button">Try again</a>
                <div className="score-sharing">
                </div>
              </div>
            </div>

            <div className="grid-container">
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
              <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
            </div>

            <div className="tile-container">
              {this.state.numStateArray.map((numState) => <NumberCell numState={numState}/>)}
              {/*<div className="tile tile-64 tile-position-1-1 tile-new">*/}
                {/*<div className="tile-inner">64</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-2 tile-position-1-2 tile-new">*/}
                {/*<div className="tile-inner">2</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-2 tile-position-1-3 tile-new">*/}
                {/*<div className="tile-inner">2</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-2 tile-position-1-4 tile-new">*/}
                {/*<div className="tile-inner">2</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-128 tile-position-2-1 tile-new">*/}
                {/*<div className="tile-inner">128</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-32 tile-position-2-2 tile-new">*/}
                {/*<div className="tile-inner">32</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-16 tile-position-2-3 tile-new">*/}
                {/*<div className="tile-inner">16</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-256 tile-position-3-1 tile-new">*/}
                {/*<div className="tile-inner">256</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-64 tile-position-3-2 tile-new">*/}
                {/*<div className="tile-inner">64</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-4 tile-position-3-3 tile-new">*/}
                {/*<div className="tile-inner">4</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-32 tile-position-4-1 tile-new">*/}
                {/*<div className="tile-inner">32</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-16 tile-position-4-2 tile-new">*/}
                {/*<div className="tile-inner">16</div>*/}
              {/*</div>*/}
              {/*<div className="tile tile-2 tile-position-4-4 tile-new">*/}
                {/*<div className="tile-inner">2</div>*/}
              {/*</div>*/}
            </div>
          </div>


          {/*<div className="fb-line">*/}
            {/*<p className="game-explanation">*/}
              {/*<strong className="important">How to play:</strong> Use your <strong>arrow*/}
              {/*keys</strong> to move the tiles. When two tiles with the same number touch,*/}
              {/*they <strong>merge into one!</strong>*/}
            {/*</p>*/}

            {/*<p className="text left">Share with friends</p>*/}

            {/*<div className="twitter-button-wrapper"></div>*/}
            {/*<a target="_blank" className="facebook-share-button"*/}
               {/*href="https://www.facebook.com/sharer/sharer.php?u=http%3A//2048game.com">Facebook</a>*/}
            {/*<div className="clear"></div>*/}

          {/*</div>*/}
          {/*<div className="clearfix"></div>*/}


          {/*<div>*/}
            {/*<ul className="unstyled tips-and-tricks">*/}
              {/*<li><a href="/tips-and-tricks">Tips &amp; Tricks</a></li>*/}
              {/*<li className="even"><a href="/videos">2048 Videos</a></li>*/}
              {/*<li><a href="/quotes">2048 Quotes</a></li>*/}
              {/*<li className="even"><a href="/variations">2048 Variations</a></li>*/}
            {/*</ul>*/}
            {/*<div className="clearfix"></div>*/}
          {/*</div>*/}

          {/*<div className="clearfix"></div>*/}
        </div>
      </div>
    );
  }
}

export default Page2048
