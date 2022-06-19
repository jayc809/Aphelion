import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import "../styles/Video.css"

const Video = ({ updateCurrTime, beatmapObj, settingsObj, tileSpeed, getAllowStart, onAllowStart, onVideoEnd, onMount, blackScreenPresent }) => {

    const [playAudio, setPlayAudio] = useState(false)
    const [playVideo, setPlayVideo] = useState(false)
    const highVolume = 0.5
    const lowVolume = 0.2
    const [volume, setVolume] = useState(highVolume)
    const infoUpdaterRef = useRef(null)
    const audioRef = useRef(null)
    const videoRef = useRef(null)
    const blackScreenRef = useRef(null)
    const musicHasStarted = useRef(false)
    const audioEndedRef = useRef(false)

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
            if (!audioEndedRef.current) {
                updateCurrTime(currTime)
            } else {
                const processTimeOffset = 0.05
                updateCurrTime((videoRef.current.getCurrentTime() + (tileSpeed * 0.853) - processTimeOffset))
            }
        } 
        if (beatmapObj.totalTime - (currTime - tileSpeed * 0.853) <= 1.9) {
            handleNearEnd()
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
                    blackScreen.style.opacity = 0
                    blackScreenPresent.current = false
                }, 1000)
            }, tileSpeed * 0.853 * 1000)
            window.removeEventListener("keypress", handlePress)
        }
    }

    const numPlayersReady = useRef(0)
    const handlePlayerReady = () => {
        numPlayersReady.current += 1
        if (numPlayersReady.current == 2) {
            setTimeout(() => {    
                onAllowStart()
            }, 500)
            onMount(setPlayAudio, setPlayVideo, setVideoVolume)
        }
    }

    const handleNearEnd = () => {
        const blackScreen = blackScreenRef.current
        blackScreen.style.opacity = 1
    }
    const handleAudioEnd = () => {
        audioEndedRef.current = true
    }
    const handleVideoEnd = () => {
        clearInterval(infoUpdaterRef.current)
        onVideoEnd("delay")
    }

    const setVideoVolume = (level) => {
        if (level == "high") {
            setVolume(highVolume)
        } else {
            setVolume(lowVolume)
        }
    }

    return (
        <div className="video-parent">
            <div className="clip-top"></div>
            <div className="clip-bottom"></div>
            <div className="black-screen" ref={blackScreenRef}></div>
            {
                !settingsObj.useVideoForBackground ?
                <img className="image-background" src={localStorage.getItem("game-background")} alt="bg"></img> :
                ""
            }
            <div className="video-wrapper" style={{opacity: settingsObj.useVideoForBackground ? 1 : 0}}>
                <ReactPlayer 
                    className="video"
                    url={beatmapObj.videoUrl}
                    playing={playVideo}
                    width="100%"
                    height="200%"
                    ref={videoRef}
                    onReady={handlePlayerReady}
                    volume={volume}
                    onEnded={handleVideoEnd}
                    style={{ pointerEvents: "none"}}
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
                    onEnded={handleAudioEnd}
                    style={{ pointerEvents: "none"}}
                    // onEnded={console.log("video ended")}
                    // onError={console.log("video error")}
                />
        </div>
        </div>
    );
}

export default Video