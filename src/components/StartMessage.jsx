import React, { useState, useEffect } from 'react'
import "../styles/StartMessage.css"

const StartMessage = () => {

    const [show, setShow] = useState(true)
    const handlePress = () => {
        setShow(false)
        window.removeEventListener('keypress', handlePress)
    }

    useEffect(() => {
        window.addEventListener("keypress", handlePress)
        return () => {
            window.removeEventListener('keypress', handlePress)
        }
    });

    return (
        <div className="start-message-wrapper" style={{animation: show ? "" : "fade-out 1s forwards"}}>
            <h3 id="press-key">Press Any Key To Start</h3>
            <h3 id="d" className="keys">D</h3>
            <h3 id="f" className="keys">F</h3>
            <h3 id="j" className="keys">J</h3>
            <h3 id="k" className="keys">K</h3>
        </div>
    )
}

export default StartMessage