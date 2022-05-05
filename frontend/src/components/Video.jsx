import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import "../styles/Video.css"

const Video = ({ videoId, updateBeatNumber, beatmapObj, tileSpeed, getAllowStart, handleAllowStart }) => {

    const [playAudio, setPlayAudio] = useState(false)
    const [playVideo, setPlayVideo] = useState(false)
    const infoUpdaterRef = useRef(null)
    const audioRef = useRef(null)
    const blackScreenRef = useRef(null)
    const musicHasStarted = useRef(false)

    useEffect(() => {
        window.addEventListener("keypress", handlePress)
        infoUpdaterRef.current = setInterval(() => {
            updateAudioInfo()
        }, beatmapObj.refreshRate)
        return () => {
            window.removeEventListener("keypress", handlePress)
            clearInterval(infoUpdaterRef.current)
        }
    }, [])

    const updateAudioInfo = () => {
        const currTime = audioRef.current.getCurrentTime()
        if (!musicHasStarted.current && 
            currTime >= beatmapObj.startTime - beatmapObj.refreshTolerance && 
            currTime <= beatmapObj.startTime + beatmapObj.refreshTolerance) {
            musicHasStarted.current = true
        }
        if (musicHasStarted.current) {
            updateBeatNumber(currTime)
        }
    }

    const handlePress = () => {
        if (getAllowStart()) {
            const blackScreen = blackScreenRef.current
            setPlayAudio(true)
            setTimeout(() => {
                setPlayVideo(true)
                setTimeout(() => blackScreen.style.animation = "fade-out 3s forwards", 1000)
            }, tileSpeed * 1000 - 10)
            window.removeEventListener("keypress", handlePress)
        }
    }

    const numPlayersReady = useRef(0)
    const handlePlayerReady = () => {
        numPlayersReady.current += 1
        if (numPlayersReady.current == 2) {
            handleAllowStart()
        }
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
                    playing={playVideo}
                    width="100%"
                    height="200%"
                    onReady={handlePlayerReady}
                    // onEnded={console.log("video ended")}
                    // onError={console.log("video error")}
                />
                <ReactPlayer 
                    className="audio"
                    url={`https://www.youtube.com/watch?v=${videoId}`}
                    muted={true}
                    playing={playAudio}
                    ref={audioRef}
                    onReady={handlePlayerReady}
                    // onEnded={console.log("video ended")}
                    // onError={console.log("video error")}
                />
        </div>
        </div>
    );
}

export default Video