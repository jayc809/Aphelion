import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import videoPlaceholder from "../images/video-placeholder.png"
import "../styles/Video.css"

const Video = ({videoId, updateProgress, bpm}) => {

    const [play, setPlay] = useState(false)
    const infoUpdaterRef = useRef(null)
    const playerRef = useRef(null)
    const blackScreenRef = useRef(null)
    const updateRate = 1000 * 60 / bpm.current

    useEffect(() => {
        window.addEventListener("keypress", handlePress)
        infoUpdaterRef.current = setInterval(() => {
            updateInfo()
        }, updateRate)
        return () => {
            window.removeEventListener("keypress", handlePress)
            clearInterval(infoUpdaterRef.current)
        }
    }, [])

    const updateInfo = () => {
        updateProgress(playerRef.current)
    }

    const handlePress = () => {
        const blackScreen = blackScreenRef.current
        setTimeout(() => blackScreen.style.animation = "fade-out 3s forwards", 1000)
        setPlay(true)
        window.removeEventListener("keypress", handlePress, false)
    }

    return (
        <div className="video-parent">
            <div className="clip-top"></div>
            <div className="clip-bottom"></div>
            <div className="video-wrapper">
                <div className="black-screen" ref={blackScreenRef}></div>
                <ReactPlayer 
                    className="video"
                    url={`https://www.youtube.com/watch?v=${videoId}`}
                    playing={play}
                    width="100%"
                    height="200%"
                    ref={playerRef}
                    // onEnded={console.log("video ended")}
                    // onError={console.log("video error")}
                />
            {/* <img src={videoPlaceholder} className="video-placeholder" alt="" /> */}
        </div>
        </div>
    );
}

export default Video