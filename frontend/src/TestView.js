import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import AnimationView from './AnimationView';
import Platform from './GameViewComponents/Platform';
import Tile from './GameViewComponents/Tile';
import HoldTile from './GameViewComponents/HoldTile';
import "./GameView.css"

const TestView = () => {

    const size = 14

    return (
        <div>
            <div style={{position: "absolute", zIndex: 10, height: "100%", width: "100%", overflow: "hidden"}}>
                
            </div>
        </div>
    )
}

export default TestView;