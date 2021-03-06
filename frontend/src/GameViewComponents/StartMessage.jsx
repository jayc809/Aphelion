import React, { useState, useEffect } from 'react'
import "../styles/StartMessage.css"

const StartMessage = ({ getAllowStart, difficulty, inTutorial }) => {

    const [show, setShow] = useState(true)
    const handlePress = (e) => {
        if (getAllowStart() && e.key != "p" && !inTutorial) { 
            setShow(false)
            window.removeEventListener('keypress', handlePress)
        }
    }

    useEffect(() => {
        window.addEventListener("keypress", handlePress)
        return () => {
            window.removeEventListener('keypress', handlePress)
        }
    }, []);

    return (
        <div className="start-message-wrapper" style={{animation: show ? "" : "fade-out 1s forwards"}}>
            {
                inTutorial ? 
                "" :
                <h3 id="press-key">Press Any Key To Start</h3>
            }
            {
                inTutorial ? 
                "" :
                <h4 id="check-keyboard">Keyboard Input Must Be English</h4>
            }
            {
                inTutorial ? 
                "" :
                <h3 id="p" className="keys">P</h3>
            }
            <h3 id="d" className="keys">D</h3>
            <h3 id="f" className="keys">F</h3>
            <h3 id="j" className="keys">J</h3>
            <h3 id="k" className="keys">K</h3>
            {
                difficulty == "Extreme" ? 
                <h3 id="s" className="keys">S</h3> : 
                ""
            }
            {
                difficulty == "Extreme" ? 
                <h3 id="l" className="keys">L</h3> : 
                ""
            }
        </div>
    )
}

export default StartMessage