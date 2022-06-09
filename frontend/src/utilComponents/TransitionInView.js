import React, { useEffect, useRef, useState } from 'react';
import transitionLeft from "../images/transition-left.png"
import transitionRight from "../images/transition-right.png"
import "../App.css"

const TransitionInView = ({ delay, settingsObj }) => {

    const left = useRef(null)
    const right = useRef(null)
    const [animationInProgress, setAnimationInProgress] = useState(true)

    useEffect(() => {
        left.current.style.opacity = 1
        right.current.style.opacity = 1
        setTimeout(() => {
            left.current.style.animation = "transition-in-left 0.85s ease-in forwards"
            right.current.style.animation = "transition-in-right 0.85s ease-in forwards"
        }, delay * 1000);
    }, [])

    return (
        animationInProgress ?
        <div className="transition-in-view-wrapper"  style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
            <img className="transition-left" src={transitionLeft} ref={left} onAnimationEnd={() => {setAnimationInProgress(false)}}></img>
            <img className="transition-right" src={transitionRight} ref={right}></img>
        </div> :
        "" 
    );
};

export default TransitionInView;