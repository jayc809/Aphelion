import React, { useEffect, useRef } from 'react';
import transitionLeft from "../images/transition-left.png"
import transitionRight from "../images/transition-right.png"
import "../App.css"

const TransitionOutView = ({ nextView, start, settingsObj }) => {

    const left = useRef(null)
    const right = useRef(null)

    useEffect(() => {
        if (start) {
            left.current.style.animation = "transition-out-left 0.85s ease-out forwards"
            right.current.style.animation = "transition-out-right 0.85s ease-out forwards"
        }
    }, [start])

    return (
        start ? 
        <div className="transition-out-view-wrapper" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
            <img className="transition-left" src={`/image?fileName=${"transition-left"}`} ref={left} onAnimationEnd={nextView} alt="left"></img>
            <img className="transition-right" src={`/image?fileName=${"transition-right"}`} ref={right} alt="right"></img>
        </div> : 
        ""
    );
};

export default TransitionOutView;