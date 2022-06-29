import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import AnimationView from './AnimationView';
import Platform from '../GameViewComponents/Platform';
import Tile from '../GameViewComponents/Tile';
import HoldTile from '../GameViewComponents/HoldTile';
import Score from '../GameViewComponents/Score';
import CircleTile from '../GameViewComponents/CircleTile';
import HalfTile from '../GameViewComponents/HalfTile';
import "../GameView.css"

const TestView = () => {

    return (
        <div className="screen">
            <div className="component" id="tile-generator">
                <HoldTile type={"left"} elapseTime={3} tileSpeed={1.3} targetTime={0} delay={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} id={100}/>
                <HoldTile type={"middle-left"} elapseTime={3} tileSpeed={1.3} targetTime={0} delay={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} id={100}/>
                <HoldTile type={"middle-right"} elapseTime={3} tileSpeed={1.3} targetTime={0} delay={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} id={100}/>
                <HoldTile type={"right"} elapseTime={3} tileSpeed={1.3} targetTime={0} delay={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} id={100}/>
                {/* <CircleTile type={"right-circle"} tileSpeed={1.3} theme={"dark"} targetTime={0} onMount={() => {}} onMiss={() => {}} id={10000}></CircleTile>   
                <CircleTile type={"left-circle"} tileSpeed={1.3} theme={"dark"} targetTime={0} onMount={() => {}} onMiss={() => {}} id={10000}></CircleTile>    */}
            </div>
            <div className="component" id="platform"> 
                <Platform settingsObj={{difficulty: "Hard"}}/>
            </div>
        </div>
    )
}

export default TestView;