import React, { useState, useEffect } from 'react';
import "../styles/Platform.css"
import platformBase from "../images/platform-base-new.png"
import platformLine from "../images/platform-line-new.png"
import platformLeft from "../images/platform-left-new.png"
import platformMiddleLeft from "../images/platform-middle-left-new.png"
import platformMiddleRight from "../images/platform-middle-right-new.png"
import platformRight from "../images/platform-right-new.png"
import circleOut from "../images/tile-circle-out.png"
import circleLight from "../images/tile-circle-light.png"


const Platform = ({ settingsObj }) => {

    const opacityWhenDown = 0.175

    const [dPressed, setDPressed] = useState(false)
    const [fPressed, setFPressed] = useState(false)
    const [jPressed, setJPressed] = useState(false)
    const [kPressed, setKPressed] = useState(false)
    const [sPressed, setSPressed] = useState(false)
    const [lPressed, setLPressed] = useState(false)

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
            case "s":
                setSPressed(true)
                break
            case "l":
                setLPressed(true)
                break
            default:
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
            case "s":
                setSPressed(false)
                break
            case "l":
                setLPressed(false)
                break
            default:
                break
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleDownLocal)
        window.addEventListener("keyup", handleUpLocal)
        return () => {
            window.removeEventListener('keydown', handleDownLocal)
            window.removeEventListener('keyup', handleUpLocal)
        }
    }, [])

    return (
        <div className="platform-parent">
            <img src={`/image?fileName=${"platform-line-new"}`} className="platform-line" alt="platformLine" draggable="false"/>
            <img 
                src={`/image?fileName=${"platform-left-new"}`} 
                className="platform-left" 
                alt="platformLeft" 
                draggable="false"
                style={{opacity: dPressed ? opacityWhenDown : 0}}
            />
            <img 
                src={`/image?fileName=${"platform-middle-left-new"}`} 
                className="platform-middle-left" 
                alt="platformMiddleLeft" 
                draggable="false"
                style={{opacity: fPressed ? opacityWhenDown : 0}}
            />
            <img 
                src={`/image?fileName=${"platform-middle-right-new"}`} 
                className="platform-middle-right"
                alt="platformMiddleRight" 
                draggable="false"
                style={{opacity: jPressed ? opacityWhenDown : 0}}
            />
            <img 
                src={`/image?fileName=${"platform-right-new"}`} 
                className="platform-right" 
                alt="platformRight" 
                draggable="false"
                style={{opacity: kPressed ? opacityWhenDown : 0}}
            />
            {
                settingsObj.difficulty == "Extreme" ?
                <div>
                    <div className="circle-tile-wrapper" style={{right: "13vw", opacity: lPressed ? opacityWhenDown : 0, zIndex: 8}}>
                        <img className="circle-tile-out" src={`/image?fileName=${"tile-circle-light"}`}></img>
                    </div> 
                    <div className="circle-tile-wrapper" style={{left: "13vw", opacity: sPressed ? opacityWhenDown : 0, zIndex: 7}}>
                        <img className="circle-tile-out" src={`/image?fileName=${"tile-circle-light"}`}></img>
                    </div> 
                    <div className="circle-tile-wrapper" style={{right: "13vw", opacity: 0.88, zIndex: 6}}>
                        <img className="circle-tile-out" src={`/image?fileName=${"tile-circle-out"}`}></img>
                    </div> 
                    <div className="circle-tile-wrapper" style={{left: "13vw", opacity: 0.88, zIndex: 5}}>
                        <img className="circle-tile-out" src={`/image?fileName=${"tile-circle-out"}`}></img>
                    </div> 
                </div> :
                ""
            }
            <img src={`/image?fileName=${"platform-base-new"}`} className="platform-base" alt="platformBase" draggable="false"/>
        </div>
    );
};

export default Platform;