import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import AnimationView from './AnimationView';
import "./GameView.css"

const TestView = () => {

    return (
        <div>
            <AnimationView height="30vh" width={"40vw"} dirName={"tap-perfect"} start={0} end={29} elapseTime={0.8}/>
        </div>
    )
}

export default TestView;