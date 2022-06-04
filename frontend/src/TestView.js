import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import AnimationView from './AnimationView';
import Platform from './GameViewComponents/Platform';
import Tile from './GameViewComponents/Tile';
import HoldTile from './GameViewComponents/HoldTile';
import "./GameView.css"

const TestView = () => {

    return (
        <div>
            {/* <Tile type={"middle-right"} tileSpeed={1.3} targetTime={0} elapseBeatCount={3} elapseTime={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} id={100}></Tile> */}
            <HoldTile type={"right"} tileSpeed={1.3} targetTime={0} elapseBeatCount={3} elapseTime={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} id={100}/>
            <Platform></Platform>
        </div>
    )
}

export default TestView;