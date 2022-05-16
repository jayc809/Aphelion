import React, { useEffect, useRef, useState } from 'react'
import "../styles/PauseMenu.css"
import pauseIcon from "../images/pause-button-icon.png"
import playIcon from "../images/play-button-icon.png"

const PauseMenu = ({ pauseGame, restartGame }) => {

    const buttonRef = useRef(null)
    const [currIcon, setCurrIcon] = useState(pauseIcon)
    const [showMenu, setShowMenu] = useState(false)

    const handlePausePlay = () => {
        if (currIcon == pauseIcon) {
            pauseGame(true)
            setCurrIcon(playIcon)
        } else {
            pauseGame(false)
            setCurrIcon(pauseIcon)
        }

        if (!showMenu) {
            setShowMenu(true)
        } else {
            setShowMenu(false)
        }
       
    }

    const handleRestart = () => {
        restartGame()
    }

    const handleExit = () => {
    }

    return (
        <div className="pause-menu-wrapper">
            <button 
                className="pause-button" 
                style={{backgroundImage: `url(${currIcon})`, backgroundSize: "contain"}}
                onClick={handlePausePlay}
            ></button>
            {
                showMenu ? 
                <div className="pause-menu">
                    <button className="pause-menu-button" onClick={handlePausePlay}>Resume</button>
                    <button className="pause-menu-button" onClick={handleRestart}>Restart</button>
                    <button className="pause-menu-button" onClick={handleExit}>Exit</button>
                </div> :
                ""
            }
        </div>
    )
}

export default PauseMenu