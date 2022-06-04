import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import AnimationView from './AnimationView';
import Platform from './GameViewComponents/Platform';
import Tile from './GameViewComponents/Tile';
import "./GameView.css"

const TestView = () => {

    return (
        <div>
            <Tile type={"left"} tileSpeed={1.3} targetTime={0} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} id={1}/>
            <Platform></Platform>
        </div>
    )
}

export default TestView;