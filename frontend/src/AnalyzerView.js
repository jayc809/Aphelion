import React, { useEffect, useState, useRef } from 'react'
import socketIOClient from "socket.io-client"
import ReactPlayer from 'react-player'
import TransitionInView from './utilComponents/TransitionInView'
import TransitionOutView from './utilComponents/TransitionOutView'
import "./App.css"
import "./AnalyzerView.css"

const AnalyzerView = ({ setView, setBeatmapObjRef, settingsObj, videoId }) => {

    const [displayText, setDisplayText] = useState("")
    const [showNextButton, setShowNextButton] = useState(false)
    const [showBackButton, setShowBackButton] = useState(false)
    const [progessBarWidth, setProgressBarWidth] = useState(0)
    const [showAnalyzer, setShowAnalyzer] = useState(false)
    const displayTextRef = useRef(null)
    const startButtonRef = useRef(null)
    const backButtonRef = useRef(null)
    const loadingVideo = "https://www.youtube.com/watch?v=JycQdXuAP0k"

    useEffect(() => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
        const socket = socketIOClient("https://www.jayc809-aphelion.com")
        setTimeout(() => {
            setShowAnalyzer(true)
        }, 700)
        socket.on("connected-to-server", () => {
            socket.emit("request-beatmap", {
                videoUrl: videoUrl,
                settingsObj: settingsObj
            })
            socket.on("progress-update", (message) => {
                setDisplayText(message)
                if (message == "ERROR: Decoding Audio Data Failed") {
                    backButtonRef.current.style.animation = "opacity-0-1 0.7s linear forwards"
                    setTimeout(() => {
                        setShowBackButton(true)
                    }, 700);
                }
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
                    setShowNextButton(true)
                }, 1200);
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

    const [transitionOut, setTransitionOut] = useState(false)
    const nextViewDestinationRef = useRef(null)
    const handleStartGame = () => {
        if (showNextButton) {
            nextViewDestinationRef.current = "game"
            setTransitionOut(true)
        }
    }
    const nextViewGame = () => {
        setView("game")
    }

    const handleReturnToVideos = () => {
        if (showBackButton) {
            nextViewDestinationRef.current = "videos"
            setTransitionOut(true)
        }
    }
    const nextViewVideos = () => {
        setView("videos")
    }

    return (
        <div className="screen-wrapper">
            <TransitionOutView nextView={
                nextViewDestinationRef.current == "game" ? nextViewGame : nextViewVideos
            } start={transitionOut} settingsObj={settingsObj}></TransitionOutView>
            <TransitionInView delay={1} settingsObj={settingsObj}></TransitionInView>
            <div className="analyzer-view-wrapper" style={{opacity: showAnalyzer ? 1 : 0}}>
                <h1 className="progress-text" ref={displayTextRef}>{displayText}</h1>
                <button 
                    className="start-game-button" onClick={handleStartGame} ref={startButtonRef} 
                    style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`, cursor: "pointer"}}>
                    Start Game
                </button> 
                <button 
                    className="back-game-button" onClick={handleReturnToVideos} ref={backButtonRef} 
                    style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`, cursor: "pointer"}}>
                    Back
                </button> 
                <div className="loading-video-wrapper">
                    <div className="loading-video">
                        <ReactPlayer url={loadingVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}}></ReactPlayer>
                    </div>
                </div>
                <div className="progress-bar" style={{width: progessBarWidth + "vw", filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                </div>
            </div>
        </div>
    )
}

export default AnalyzerView;