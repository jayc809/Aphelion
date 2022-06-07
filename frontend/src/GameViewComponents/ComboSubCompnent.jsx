import React, { useEffect, useRef, useState } from 'react';
import "../styles/Combo.css"
import AnimationViewContained from '../AnimationViewContained'

const ComboSubCompnent = ({ combo }) => {

    const size = 14
    const initialComboRef = useRef(combo)
    
    useEffect(() => {
        comboDisplayRef.current.style.transition = "opacity 0.3s"
        mainContentRef.current.style.animation = "move-combo-animation 0.15s ease-out forwards"
    }, [])

    const mainContentRef = useRef(null)
    const comboDisplayRef = useRef(null)

    useEffect(() => {
        if (combo != 0) {
            comboDisplayRef.current.style.opacity = 1
        } else if (combo == 0) {
            comboDisplayRef.current.style.opacity = 0
        } 
    }, [combo])

    return (
        <div ref={mainContentRef} style={{position: "absolute", height: `${size * 3}vh`, width: `calc(${size * 6}vh)`, overflow: "hidden",
        top: "27.5vh", display: "grid", placeItems: "center", opacity: 0}}>
            {
                combo != 0 ?
                <div style={{position: "absolute", zIndex: 10, height: `${size * 3}vh`, width: `calc(${size * 6}vh)`}}>
                    <AnimationViewContained
                        dirName="combo" start={0} end={19} loop={false} onComplete={() => {}}
                    ></AnimationViewContained> 
                </div> :
                ""
            }
            <div ref={comboDisplayRef} style={{position: "absolute", zIndex: 100, height: `${size * 2}vh`, width: `calc(${size * 6}vh)`}}>
                <svg style={{fontFamily: "Futura-Light-Italic", fontSize: `${size * 0.8}vh`, width : `calc(${size * 3.6}vh)`, height: `${size * 1.6}vh`, textAnchor: "end"}}>
                    <text x={"100%"} y={"75%"} 
                        style={{fill: "white", stroke: "#6142b8", strokeWidth: (size / 25) + "vh", strokeLinejoin: "miter-clip", margin: "0",
                        letterSpacing: (size / 30) + "vh", filter: `blur(${size / 40}vh)`}}
                    >
                        {"x" + initialComboRef.current}
                    </text>
                    <text x={"100%"} y={"75%"} 
                            style={{fill: "white", strokeLinejoin: "miter-clip", margin: "0",
                            letterSpacing: (size / 30) + "vh", filter: `blur(${size / 350}vh)`}}
                        >
                        {"x" + initialComboRef.current}
                    </text>
                </svg>
            </div> 
        </div>
    );
};

export default ComboSubCompnent;