import React, { useEffect, useRef, useState } from 'react'
import "../styles/Score.css"

const Score = ({ onMount }) => {

    const [score, setScore] = useState(0)
    const [scoreText, setScoreText] = useState(0)
    
    useEffect(() => {
        onMount(score, setScore)
    }, [])

    useEffect(() => {
        const incrementer = setInterval(() => {
          if (score > scoreText) {
            setScoreText(scoreText + parseInt((score - scoreText) / 7) + 1)
          } else {
            setScoreText(score)
          }
        }, 50)
        return () => {
          clearInterval(incrementer)
        }
      }, [score, scoreText])

    const formatScoreText = () => String(scoreText).padStart(12, '0')

    return (
        <div className="score-wrapper">
            <h3>{formatScoreText()}</h3>
        </div>
    )
}

export default Score