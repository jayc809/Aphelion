import React, { useEffect, useRef, useState } from 'react'
import "../styles/Combo.css"

const PerfectDisplay = ({ onMount, settingsObj }) => {
    
    const [displayText, setDisplayText] = useState(false)
    const size = 8
    const mainContentRef = useRef(null)

    useEffect(() => {
        onMount(setDisplayText)
    }, [])

    useEffect(() => {
        if (displayText) {
            mainContentRef.current.style.opacity = 1
        } else {
            mainContentRef.current.style.opacity = 0
        }
    }, [displayText])

    return (
        <div className="combo-wrapper" 
            style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}
        >
            <div className={displayText ? "perfect-content-showing" : "perfect-content-hidden"} ref={mainContentRef}>
                <svg style={{fontFamily: "Futura-Light-Italic", fontSize: `${size * 0.8}vh`, width : "50vh", height: `${size}vh`, textAnchor: "end"}}>
                    <text x={"100%"} y={"75%"} 
                        style={{fill: "white", stroke: "#6142b8", strokeWidth: (size / 18) + "vh", strokeLinejoin: "miter-clip", margin: "0",
                        letterSpacing: (size / 28) + "vh", filter: `blur(${size / 50}vh)`}}
                    >
                        perfect
                    </text>
                    <text x={"100%"} y={"75%"} 
                            style={{fill: "white", strokeLinejoin: "miter-clip", margin: "0",
                            letterSpacing: (size / 28) + "vh"}}
                        >
                        perfect
                    </text>

                </svg>
            </div>
        </div>
    )
}

export default PerfectDisplay