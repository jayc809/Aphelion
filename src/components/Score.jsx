import React, { useEffect } from 'react'
import "../styles/Score.css"

const Score = ({ score }) => {

    const formatScore = () => String(score).padStart(12, '0')

    return (
        <div className="score-wrapper">
            <h3>{formatScore()}</h3>
        </div>
    )
}

export default Score