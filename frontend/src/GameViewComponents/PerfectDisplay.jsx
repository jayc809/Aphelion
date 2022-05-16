import React, { useEffect, useState } from 'react'
import "../styles/Combo.css"

const PerfectDisplay = ({ onMount }) => {
    
    const [displayText, setDisplayText] = useState(false)
    useEffect(() => {
        onMount(setDisplayText)
    }, [])

    const formatText = () => {
        return displayText ? "Perfect" : ""
    }

    const formatStyle = () => {
        const color = "yellow"
        return {color: color}
    }

    return (
        <div className="combo-wrapper">
            <h3 className="perfect-text" style={formatStyle()}>{formatText()}</h3>
        </div>
    )
}

export default PerfectDisplay