import React, { useEffect, useRef } from 'react'
import "../styles/Combo.css"

const Combo = ({ combo }) => {

    const comboRef = useRef(null)

    const formatCombo = () => {
        return "x" + combo
    }

    useEffect(() => {
        comboRef.current.style.color = "yellow"
    }, [combo])

    return (
        <div className="combo-wrapper">
            <h3 ref={comboRef}>{formatCombo()}</h3>
        </div>
    )
}

export default Combo