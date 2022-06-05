import React, { useEffect, useRef, useState } from 'react'
import "../styles/Combo.css"

const Combo = ({ onMount, settingsObj }) => {

    const [combo, setCombo] = useState(0)
    const size = 14
    
    useEffect(() => {
        onMount(combo, setCombo)
    }, [])

    return (
        <div className="combo-wrapper" 
            style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}
        >
            <div style={{position: "absolute", top: "36vh", right: "2.5vw"}}>
                <svg style={{fontFamily: "Futura-Light-Italic", fontSize: `${size * 0.8}vh`, width : "50vh", height: `${size}vh`, textAnchor: "end"}}>
                    <text x={"100%"} y={"75%"} 
                        style={{fill: "white", stroke: "#6142b8", strokeWidth: (size / 25) + "vh", strokeLinejoin: "miter-clip", margin: "0",
                        letterSpacing: (size / 30) + "vh", filter: `blur(${size / 100}vh)`}}
                    >
                        {"x" + combo}
                    </text>
                    <text x={"100%"} y={"75%"} 
                            style={{fill: "white", strokeLinejoin: "miter-clip", margin: "0",
                            letterSpacing: (size / 30) + "vh"}}
                        >
                        {"x" + combo}
                    </text>
                </svg>
            </div>
        </div>
    )
}

export default Combo