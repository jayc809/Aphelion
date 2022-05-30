import React, { useEffect, useRef } from 'react';
import transitionLeft from "./images/transition-left.png"
import transitionRight from "./images/transition-right.png"
import "./App.css"

const TransitionOutView = ({ nextView }) => {

    const left = useRef(null)
    const right = useRef(null)

    useEffect(() => {
        left.current.style.animation = "transition-out-left 0.85s ease-out forwards"
        right.current.style.animation = "transition-out-right 0.85s ease-out forwards"
    }, [])

    return (
        <div className="transition-out-view-wrapper">
            <img className="transition-left" src={transitionLeft} ref={left} onAnimationEnd={nextView}></img>
            <img className="transition-right" src={transitionRight} ref={right}></img>
        </div>
    );
};

export default TransitionOutView;