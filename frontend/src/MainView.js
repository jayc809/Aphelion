import React, { useEffect, useRef, useState } from 'react'
import "./MainView.css"
import ReactPlayer from 'react-player'
import TransitionInView from './TransitionInView'
import TransitionOutView from './TransitionOutView'
import githubBackground from "./images/github-button.png"
import instructionsBackground from "./images/instructions-button.png"
import loginBackground from "./images/login-button.png"

const MainView = ({ setView, settingsObj, showTransition, setShowTransition }) => {

    const backgroundVideo = "https://www.youtube.com/watch?v=jH1LBL_v7Qs"
    const loadingVideo = "https://www.youtube.com/watch?v=JycQdXuAP0k"
    const [startButtonOpacity, setStartButtonOpacity] = useState(1)
    const blinkInterval = 1.75
    const blackScreenRef = useRef(null)
    const [showBlackScreen, setShowBlackScreen] = useState(true)

    useEffect(() => {
        const blink = setInterval(() => {
            if (startButtonOpacity == 1) {
                setStartButtonOpacity(0.2)
            } else {
                setStartButtonOpacity(1)
            }
        }, blinkInterval * 1000)
        return ( )=> {
            clearInterval(blink)
        }
    }, [startButtonOpacity])

    const handleVideoReady = () => {
        blackScreenRef.current.style.animation = "opacity-1-0 1s ease-in forwards"
        setTimeout(() => {
            setShowBlackScreen(false)
        }, 1000)
    }

    const handleGithubClick = () => {
        window.open("https://github.com/jayc809/aphelion-tests/")
    }

    const handleStartGame = () => {
        setShowTransition(true)
        setTransitionOut(true)
    }

    const [transitionOut, setTransitionOut] = useState(false)
    const nextView = () => {
        setView("videos")
    }

    return (
        <div className="screen-wrapper">
            {
                showTransition ? 
                <TransitionInView delay={1} settingsObj={settingsObj}></TransitionInView> :
                ""
            }
            <TransitionOutView nextView={nextView} start={transitionOut} settingsObj={settingsObj}></TransitionOutView>
            <div className="main-view-wrapper">
                {
                    showBlackScreen ? 
                    <div ref={blackScreenRef} style={{height: "100vh", width: "100vw", backgroundColor: "black", position: "absolute", zIndex: 1000}}></div> :
                    ""
                }
                <button className="main-view-start-button" 
                    style={{opacity: startButtonOpacity, transition: startButtonOpacity == 1 ? `opacity ${blinkInterval}s ease-out` : `opacity ${blinkInterval}s ease-in`}}
                    onClick={handleStartGame}
                >
                    Start Game
                </button>
                <div className="main-view-buttons-wrapper">
                    <button style={{backgroundImage: `url(${githubBackground})`}} onClick={handleGithubClick}></button>
                    <button style={{backgroundImage: `url(${instructionsBackground})`}}></button>
                    <button style={{backgroundImage: `url(${loginBackground})`}}></button>
                </div>
                <div className="loading-video-wrapper">
                    <div className="loading-video">
                        <ReactPlayer url={loadingVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}} onPlay={handleVideoReady}></ReactPlayer>
                    </div>
                </div>
                <div className="background-video-wrapper"> 
                    <div className="background-video">
                        <ReactPlayer url={backgroundVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}}></ReactPlayer>
                    </div>
                </div>  
            </div>  
        </div>
    )
}

export default MainView

