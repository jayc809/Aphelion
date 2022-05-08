import React, { useEffect, useRef, useState } from 'react'
import "../styles/Combo.css"

const Combo = ({ onMount }) => {

    const comboRef = useRef(null)
    const [combo, setCombo] = useState(0)
    
    useEffect(() => {
        onMount(combo, setCombo)
    }, [])

    const formatComboText = () => {
        return "x" + combo
    }

    const formatComboStyle = () => {
        const color = "yellow"
        return {color: color}
    }

    return (
        <div className="combo-wrapper">
            <h3 ref={comboRef} style={formatComboStyle()}>{formatComboText()}</h3>
        </div>
    )
}

export default Combo