import React, { useEffect, useRef, useState } from 'react'
import "../styles/Combo.css"
import AnimationView from '../AnimationView'

const Combo = ({ onMount, settingsObj }) => {

    const [combo, setCombo] = useState(0)
    const size = 14
    
    useEffect(() => {
        onMount(combo, setCombo)
        comboDisplayRef.current.style.transition = "opacity 0.5s"
    }, [])

    const [comboKey, setComboKey] = useState(0)
    const mainContentRef = useRef(null)
    const comboDisplayRef = useRef(null)

    useEffect(() => {
        setComboKey(comboKey + 1)
        if (combo == 1) {
            // mainContentRef()
            comboDisplayRef.current.style.opacity = 1
        } else if (combo == 0) {
            comboDisplayRef.current.style.opacity = 0
        }
    }, [combo])


    return (
        <div className="combo-wrapper" 
            style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}
        >
            <div ref={mainContentRef} style={{position: "absolute", height: "100%", width: "100%"}}>
                {
                    combo != 0 ?
                    <div style={{position: "absolute", zIndex: 10, height: "100%", width: "100%", overflow: "hidden"}}>
                        <AnimationView 
                            height={`${size * 2}vh`} width={`calc(${size * 2}vh * 2)`} x="93vw" y="45vh" dirName="combo" 
                            start={0} end={19} loop={false} onComplete={() => {}} key={comboKey}
                        ></AnimationView> 
                    </div> :
                    ""
                }
                <div ref={comboDisplayRef} style={{position: "absolute", zIndex: 100, top: "38vh", right: "2.5vw"}}>
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
        </div>
    )
}

export default Combo