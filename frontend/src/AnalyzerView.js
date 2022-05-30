import React, { useEffect, useState, useRef } from 'react'
import socketIOClient from "socket.io-client"
import ReactPlayer from 'react-player'
import "./App.css"
import "./AnalyzerView.css"

const AnalyzerView = ({ setView, setBeatmapObjRef, settingsObj, videoId }) => {

    const [displayText, setDisplayText] = useState("")
    const [showButton, setShowButton] = useState(false)
    const [progessBarWidth, setProgressBarWidth] = useState(0)
    const displayTextRef = useRef(null)
    const startButtonRef = useRef(null)
    const loadingVideo = "https://www.youtube.com/watch?v=JycQdXuAP0k"

    useEffect(() => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
        const socket = socketIOClient("http://localhost:5000")
        socket.on("connected-to-server", () => {
            socket.emit("request-beatmap", videoUrl)
            socket.on("progress-update", (message) => {
                setDisplayText(message)
            })
            socket.on("respond-beatmap", (beatmapObjRes) => {
                const beatmapObj = beatmapObjRes
                beatmapObj.refreshRate = 0.01 * 1000
                beatmapObj.refreshTolerance = 0.008
                socket.disconnect()
                setBeatmapObjRef(beatmapObj)
                displayTextRef.current.style.animation = "opacity-1-0 0.7s linear forwards"
                setTimeout(() => {
                    startButtonRef.current.style.animation = "opacity-0-1 0.7s linear forwards"
                }, 700);
                setTimeout(() => {
                    setShowButton(true)
                }, 2000);
            })
        })
    }, [])

    useEffect(() => {
        if (displayText == "Downloading Video") {
            setProgressBarWidth(25)
        } else if (displayText == "Decoding Audio Data") {
            setProgressBarWidth(50)
        } else if (displayText == "Generating Beatmap") {
            setProgressBarWidth(75)
        } else if (displayText == "Process Completed") {
            setProgressBarWidth(100)
        }
    }, [displayText])

    const handleStartGame = () => {
        if (showButton) {
            setView("game")
        }
    }

    return (
        <div className="analyzer-view-wrapper">
            <h1 className="progress-text" ref={displayTextRef}>{displayText}</h1>
            <button 
                className="start-game-button" onClick={handleStartGame} ref={startButtonRef} 
                style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                Start Game
            </button> 
            <div className="loading-video-wrapper">
                <div className="loading-video">
                    <ReactPlayer url={loadingVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}}></ReactPlayer>
                </div>
            </div>
            <div className="progress-bar" style={{width: progessBarWidth + "vw", filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
            </div>
        </div>
    )

    const fetchExpress = () => {
        // fetch(`/getBeatmap?videoUrl=${test}`)
        // .then(response => response.json())
        // .then(json => {
        //     console.log(json)
        //     const beatmapObj = json
        //     beatmapObj.refreshRate = 0.01 * 1000
        //     beatmapObj.refreshTolerance = 0.0099
        //     setDisplayText("analysis completed")
        //     setBeatmapObjRef(beatmapObj)
        //     setShowButton(true)
        // })
    }
}

export default AnalyzerView;