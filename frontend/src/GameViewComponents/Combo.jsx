import React, { useEffect, useRef, useState } from 'react'
import "../styles/Combo.css"
import ComboSubCompnent from './ComboSubCompnent'

const Combo = ({ onMount, settingsObj }) => {

    const [combo, setCombo] = useState(0)
    
    useEffect(() => {
        onMount(combo, setCombo)
    }, [])

    const [comboKey, setComboKey] = useState(0)

    useEffect(() => {
        if (combo != 0) {
            setComboKey(comboKey + 1)
        }
    }, [combo])


    return (
        <div className="combo-wrapper" 
            style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}
        >
            <ComboSubCompnent combo={combo} key={comboKey}></ComboSubCompnent>
        </div>
    )
}

export default Combo