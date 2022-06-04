import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import AnimationView from './AnimationView';
import Platform from './GameViewComponents/Platform';
import Tile from './GameViewComponents/Tile';
import "./GameView.css"

const TestView = () => {

    return (
        <div>
            <img src={require("./images/a-tier.png")}></img>
            <img src={require("./animations/tap-perfect/tap-perfect-00.png")} style={{filter: "hue-rotate(354deg)"}}></img>
        </div>
    )
}

export default TestView;