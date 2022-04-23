import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import videoPlaceholder from "../images/video-placeholder.png"
import "../styles/Video.css"

const Video = ({videoId}) => {

    const [play, setPlay] = useState(false)
    const playerRef = useRef(null)
    const blackScreenRef = useRef(null)

    useEffect(() => {
        if (!play) {
            window.addEventListener("keypress", handlePress)
            return () => {
                window.removeEventListener("keypress", handlePress)
            }
        }
        const infoUpdater = setInterval(updateInfo, 100)
        return () => {
            clearInterval(infoUpdater)
        }
    })

    const updateInfo = () => {
        const player = playerRef.current
        console.log(player.getCurrentTime())
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
                />
            {/* <img src={videoPlaceholder} className="video-placeholder" alt="" /> */}
        </div>
        </div>
    );
}

export default Video