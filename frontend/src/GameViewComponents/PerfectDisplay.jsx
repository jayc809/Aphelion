import React, { useEffect, useState } from 'react'
import "../styles/Combo.css"

const PerfectDisplay = ({ onMount, settingsObj }) => {
    
    const [displayText, setDisplayText] = useState(false)
    const size = 8
    useEffect(() => {
        onMount(setDisplayText)
    }, [])

    return (
        <div className="combo-wrapper" 
            style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}
        >
            <div style={{position: "absolute", top: "52vh", right: "3vw"}}>
                <svg style={{fontFamily: "Futura-Light-Italic", fontSize: `${size * 0.8}vh`, width : "50vh", height: `${size}vh`, textAnchor: "end"}}>
                    <text x={"100%"} y={"75%"} 
                        style={{fill: "white", stroke: "#6142b8", strokeWidth: (size / 18) + "vh", strokeLinejoin: "miter-clip", margin: "0",
                        letterSpacing: (size / 28) + "vh", filter: `blur(${size / 50}vh)`}}
                    >
                        {displayText ? "perfect" : ""}
                    </text>
                    <text x={"100%"} y={"75%"} 
                            style={{fill: "white", strokeLinejoin: "miter-clip", margin: "0",
                            letterSpacing: (size / 28) + "vh"}}
                        >
                        {displayText ? "perfect" : ""}
                    </text>

                </svg>
            </div>
        </div>
    )
}

export default PerfectDisplay