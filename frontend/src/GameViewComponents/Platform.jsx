import React, { useState, useEffect } from 'react';
import "../styles/Platform.css"
import platformBase from "../images/platform-base-new.png"
import platformLine from "../images/platform-line-new.png"
import platformLeft from "../images/platform-left-new.png"
import platformMiddleLeft from "../images/platform-middle-left-new.png"
import platformMiddleRight from "../images/platform-middle-right-new.png"
import platformRight from "../images/platform-right-new.png"
import circleOut from "../images/tile-circle-out.png"


const Platform = ({ settingsObj }) => {

    const opacityWhenDown = 0.175

    const [dPressed, setDPressed] = useState(false)
    const [fPressed, setFPressed] = useState(false)
    const [jPressed, setJPressed] = useState(false)
    const [kPressed, setKPressed] = useState(false)

    const handleDownLocal = (e) => {
        const key = e.key
        switch (key) {
            case "d":
                setDPressed(true)
                break
            case "f":
                setFPressed(true)
                break
            case "j":
                setJPressed(true)
                break
            case "k":
                setKPressed(true)
                break
        }
    }
    const handleUpLocal = (e) => {
        const key = e.key
        switch (key) {
            case "d":
                setDPressed(false)
                break
            case "f":
                setFPressed(false)
                break
            case "j":
                setJPressed(false)
                break
            case "k":
                setKPressed(false)
                break
        }
    }

    console.log(settingsObj.difficulty)

    useEffect(() => {
        window.addEventListener("keydown", handleDownLocal)
        window.addEventListener("keyup", handleUpLocal)
        return () => {
            window.removeEventListener('keydown', handleDownLocal)
            window.removeEventListener('keyup', handleUpLocal)
        }
    }, [handleDownLocal, handleUpLocal])

    return (
        <div className="platform-parent">
            <img src={platformLine} className="platform-line" alt="platformLine" draggable="false"/>
            <img 
                src={platformLeft} 
                className="platform-left" 
                alt="platformLeft" 
                draggable="false"
                style={{opacity: dPressed ? opacityWhenDown : 0}}
            />
            <img 
                src={platformMiddleLeft} 
                className="platform-middle-left" 
                alt="platformMiddleLeft" 
                draggable="false"
                style={{opacity: fPressed ? opacityWhenDown : 0}}
            />
            <img 
                src={platformMiddleRight} 
                className="platform-middle-right"
                alt="platformMiddleRight" 
                draggable="false"
                style={{opacity: jPressed ? opacityWhenDown : 0}}
            />
            <img 
                src={platformRight} 
                className="platform-right" 
                alt="platformRight" 
                draggable="false"
                style={{opacity: kPressed ? opacityWhenDown : 0}}
            />
            {
                settingsObj.difficulty == "Hard" || settingsObj.difficulty == "Extreme" ? 
                <div className="circle-tile-wrapper" style={{right: "9vw", opacity: 0.88}}>
                    <img className="circle-tile-out" src={circleOut}></img>
                </div> :
                ""
            }
            {
                settingsObj.difficulty == "Hard" || settingsObj.difficulty == "Extreme" ? 
                <div className="circle-tile-wrapper" style={{left: "9vw", opacity: 0.88}}>
                    <img className="circle-tile-out" src={circleOut}></img>
                </div> : 
                ""
            }
            <img src={platformBase} className="platform-base" alt="platformBase" draggable="false"/>
        </div>
    );
};

export default Platform;