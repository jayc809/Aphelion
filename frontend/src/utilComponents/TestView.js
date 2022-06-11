import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import AnimationView from './AnimationView';
import Platform from '../GameViewComponents/Platform';
import Tile from '../GameViewComponents/Tile';
import HoldTile from '../GameViewComponents/HoldTile';
import Score from '../GameViewComponents/Score';
import CircleTile from '../GameViewComponents/CircleTile';
import "../GameView.css"

const TestView = () => {

    const size = 14

    return (
        <div>
            <CircleTile type={"left"} tileSpeed={1.3} theme={"dark"} targetTime={0} onMount={() => {}} onMiss={() => {}} id={1}></CircleTile>
            <HoldTile type={"left"} tileSpeed={1.3} targetTime={0} elapseBeatCount={3} elapseTime={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} id={100}/>
            <Platform></Platform>
        </div>
    )
}

export default TestView;