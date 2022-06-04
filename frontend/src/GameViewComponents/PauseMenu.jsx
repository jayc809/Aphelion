import React, { useEffect, useRef, useState } from 'react'
import "../styles/PauseMenu.css"
import pauseIcon from "../images/pause-button-icon.png"
import playIcon from "../images/play-button-icon.png"
import SettingsList from '../VideoSelectorComponents/SettingsList'

const PauseMenu = ({ pauseGame, restartGame, endGame, settingsObj, setSettingsObj }) => {

    const [currIcon, setCurrIcon] = useState(pauseIcon)
    const [showMenu, setShowMenu] = useState(false)
    const allowClick = useRef(true)

    useEffect(() => {
        window.addEventListener("keypress", handlePress)
        return () => {
            window.removeEventListener("keypress", handlePress)
        }
    }, [showMenu])

    const handlePress = (e) => {
        if (e.key == "p") {
            handlePausePlay()
        }
    }

    const handlePausePlay = () => {
        if (allowClick.current) {
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
            allowClick.current = false
            setTimeout(() => {
                allowClick.current = true
            }, 500);
        }
       
    }

    const handleRestart = () => {
        restartGame()
    }

    const handleExit = () => {
        endGame("no delay")
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
                    <div className="pause-menu-settings-wrapper">
                        <SettingsList settingsObj={settingsObj} setSettingsObj={setSettingsObj} pauseMenu={true}></SettingsList>
                    </div>
                    <div className="pause-menu-button-wrapper">
                        <button className="pause-menu-button" onClick={handlePausePlay}>Resume</button>
                        <button className="pause-menu-button" onClick={handleRestart}>Restart</button>
                        <button className="pause-menu-button" onClick={handleExit}>Quit</button>
                    </div>
                </div> :
                ""
            }
        </div>
    )
}

export default PauseMenu