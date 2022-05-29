import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import "../styles/Video.css"

const Video = ({ updateCurrTime, beatmapObj, tileSpeed, getAllowStart, onAllowStart, onVideoEnd, onMount, blackScreenPresent }) => {

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
        if (musicHasStarted.current) {
            updateCurrTime(currTime)
        }
    }

    const handlePress = (e) => {
        if (getAllowStart() && e.key != "p") {
            const blackScreen = blackScreenRef.current
            setPlayAudio(true)
            musicHasStarted.current = true
            setTimeout(() => {
                setPlayVideo(true)
                setTimeout(() => {
                    blackScreen.style.animation = "fade-out 3s forwards"
                    blackScreenPresent.current = false
                }, 1000)
            }, tileSpeed * 0.86 * 1000)
            window.removeEventListener("keypress", handlePress)
        }
    }

    const numPlayersReady = useRef(0)
    const handlePlayerReady = () => {
        numPlayersReady.current += 1
        if (numPlayersReady.current == 2) {
            onAllowStart()
            onMount(setPlayAudio, setPlayVideo)
        }
    }

    const handleEnd = () => {
        const blackScreen = blackScreenRef.current
        blackScreen.style.animation = "none"
        blackScreen.style.opacity = 1
        clearInterval(infoUpdaterRef.current)
        onVideoEnd()
    }

    return (
        <div className="video-parent">
            <div className="clip-top"></div>
            <div className="clip-bottom"></div>
            <div className="video-wrapper">
                <div className="black-screen" ref={blackScreenRef}></div>
                <ReactPlayer 
                    className="video"
                    url={beatmapObj.videoUrl}
                    playing={playVideo}
                    width="100%"
                    height="200%"
                    onReady={handlePlayerReady}
                    onEnded={handleEnd}
                    volume={0.5}
                    // onEnded={console.log("video ended")}
                    // onError={console.log("video error")}
                />
                <ReactPlayer 
                    className="audio"
                    url={beatmapObj.videoUrl}
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