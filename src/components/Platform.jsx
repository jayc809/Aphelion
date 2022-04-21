import React, { useState, useEffect } from 'react';
import "../styles/Platform.css"
import platformBase from "../images/platform-base.png"
import platformLine from "../images/platform-line.png"
import platformLeft from "../images/platform-left.png"
import platformMiddleLeft from "../images/platform-middle-left.png"
import platformMiddleRight from "../images/platform-middle-right.png"
import platformRight from "../images/platform-right.png"


const Platform = ({handleDown, handleUp}) => {

    const opacityWhenDown = 0.18

    const [dPressed, setDPressed] = useState(false)
    const [fPressed, setFPressed] = useState(false)
    const [jPressed, setJPressed] = useState(false)
    const [kPressed, setKPressed] = useState(false)

    const handleDownLocal = (e) => {
        const key = e.key
        switch (key) {
            case "d":
                // console.log("d down")
                setDPressed(true)
                break
            case "f":
                // console.log("f down")
                setFPressed(true)
                break
            case "j":
                // console.log("j down")
                setJPressed(true)
                break
            case "k":
                // console.log("k down")
                setKPressed(true)
                break
        }
        handleDown(key)
    }
    const handleUpLocal = (e) => {
        const key = e.key
        switch (key) {
            case "d":
                // console.log("d up")
                setDPressed(false)
                break
            case "f":
                // console.log("f up")
                setFPressed(false)
                break
            case "j":
                // console.log("j up")
                setJPressed(false)
                break
            case "k":
                // console.log("k up")
                setKPressed(false)
                break
        }
        handleUp(key)
    }

    useEffect(() => {
        window.addEventListener("keydown", handleDownLocal)
        window.addEventListener("keyup", handleUpLocal)
        return () => {
            window.removeEventListener('keydown', handleDownLocal)
            window.removeEventListener('keyup', handleUpLocal)
        }
    }, [handleDownLocal, handleUpLocal]);

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
            <img src={platformBase} className="platform-base" alt="platformBase" draggable="false"/>
        </div>
    );
};

export default Platform;