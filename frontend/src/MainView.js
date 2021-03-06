import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./MainView.css"
import ReactPlayer from 'react-player'
import TransitionInView from './utilComponents/TransitionInView'
import TransitionOutView from './utilComponents/TransitionOutView'
import githubBackground from "./images/github-button.png"
import instructionsBackground from "./images/instructions-button.png"
import loginBackground from "./images/login-button.png"
import loginBackgroundFilled from "./images/login-button-filled.png"
import PopUpView from './utilComponents/PopUpView'
import LoginView from './utilComponents/LoginView'

const MainView = ({ setView, settingsObj, showTransition, setShowTransition, isDownloadingImages, progressBarWidth, user, setUser }) => {

    const backgroundVideo = "https://www.youtube.com/watch?v=jH1LBL_v7Qs"
    const loadingVideo = "https://www.youtube.com/watch?v=JycQdXuAP0k"
    const [startButtonOpacity, setStartButtonOpacity] = useState(1)
    const blinkInterval = 1.2
    const blackScreenRef = useRef(null)
    const [showBlackScreen, setShowBlackScreen] = useState(true)
    const patchnotes = `
        <h3> Hi! Welcome! Thanks for stopping by! <h3>
        <h3> Here are the patch notes and some FAQs <h3>
        <br>
        <h2> What is Aphelion? <h2>
        <h4> 
            Aphelion is a revolutionizing rhythm game allowing you to play any song that's available on YouTube.
        <h4>
        <br>
        <h2> How does Aphelion work? <h2>
        <h4> 
            Aphelion's beatmap generation algorithm relies on a string of processes. First, you select a song and choose the settings. Then, 
            your computer connects to the backend and sends the information over, allowing a virtual machine to download the video you requested.
            Once the download is complete, an algorithm decodes the audio data and generates a beatmap. This process includes finding 
            the start time of the song, calculating the tempo, and analyzing the frequency/magnitude ranges of each beat. Then, based on
            the predicted genre and the difficulty you've selected, your song is modeled by the best algorithm. Finally, the beatmap data is sent back to 
            you and the game is ready!
        <h4>
        <br>
        <h2> Why do some songs feel "off"? <h2>
        <h4> 
            Unfortunately, the algorithm is not perfect. One of the biggest shortcomings right now is that it doesn't always identify the start time of the song
            correctly. For instance, if you song has some noise before the music actually starts, the algorithm may mistakenly identify the instant as
            when the song begins, thus messing up the tempo. To partially accomodate for this problem, you can consider manually setting the start time in settings, 
            go try it out! Another issue is that at the moment, the algorithm does not support songs with tempo changes. That is, Sicko Mode will have to wait. 
        <h4>
        <br>
        <h2> Patch Notes 6/6 <h2>
        <h5> - Added customizable start time <h5>
        <h5> - Added option to use image as game background <h5>
        <h4> Coming Soon... <h4>
        <h5> - Fix hold note not properly pausing when game is paused <h5>
        <h5> - Login system <h5>
        <br>
        <br>
        <h3> You've reached the end! Thank you and most importantly... Have fun! <h3>
        <h3> - Jay <h3>
    `

    useEffect(() => {
        setTimeout(() => {
            if (blackScreenRef.current) {
                blackScreenRef.current.style.animation = "opacity-1-0 1s ease-in forwards"
            }
            setTimeout(() => {
                setShowBlackScreen(false)
            }, 1000)
        }, 2000)
    }, [])

    useEffect(() => {
        const blink = setInterval(() => {
            if (startButtonOpacity == 1) {
                setStartButtonOpacity(0.2)
            } else {
                setStartButtonOpacity(1)
            }
        }, blinkInterval * 1000)
        return () => {
            clearInterval(blink)
        }
    }, [startButtonOpacity])

    const handleVideoReady = () => {
        if (blackScreenRef.current) {
            blackScreenRef.current.style.animation = "opacity-1-0 1s ease-in forwards"
            setTimeout(() => {
                setShowBlackScreen(false)
            }, 1000)
        }
    }

    const handleGithubClick = () => {
        window.open("https://github.com/jayc809/aphelion-tests/")
    }

    const [showInstructions, setShowInstructions] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    const handleInstructionsClick = useCallback(() => {
        if (showInstructions) {
            setShowInstructions(false)
        } else {
            if (showLogin) {
                setShowLogin(false)
            }
            setShowInstructions(true)
        }
        setCanStartRef(true)
    }, [showInstructions, showLogin])

    const canStartRef = useRef(true)
    const setCanStartRef = (tf) => {
        canStartRef.current = tf
    }
    const handleLoginClick = useCallback(() => {
        if (showLogin) {
            setShowLogin(false)
        } else {
            if (showInstructions) {
                setShowInstructions(false)
            }
            setShowLogin(true)
        }
        setCanStartRef(true)
    }, [showInstructions, showLogin])

    const handleStartGame = () => {
        if (!isDownloadingImages && canStartRef.current) {
            setShowTransition(true)
            setTransitionOut(true)
        }
    }

    const [ready, setReady] = useState(false)
    const progressBarRef = useRef(null)
    useEffect(() => {
        if (!isDownloadingImages) {
            setStartButtonOpacity(0)
            progressBarRef.current.style.opacity = 0
            setTimeout(() => {        
                setReady(true)
            }, blinkInterval * 1000)
        } else {
            setReady(false)
        }
    }, [isDownloadingImages])

    const [transitionOut, setTransitionOut] = useState(false)
    const nextView = () => {
        setShowInstructions(false)
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
                    showInstructions ? 
                    <PopUpView height="50vh" width="50vw" x="49vw" y="47.5vh" fontSize="3vh" text={patchnotes}></PopUpView> :
                    ""
                }
                {
                    showLogin ? 
                    <LoginView height="35vh" width="calc(35vh * 670 / 422)" x="49vw" y="47.5vh" fontSize="3vh" user={user} setUser={setUser} setCanStartRef={setCanStartRef} handleLoginClick={handleLoginClick}></LoginView> :
                    ""
                }
                {
                    showBlackScreen ? 
                    <div ref={blackScreenRef} style={{height: "100vh", width: "100vw", backgroundColor: "black", position: "absolute", zIndex: 1000}}></div> :
                    ""
                }
                <button className="main-view-start-button" 
                    style={{
                        opacity: startButtonOpacity, transition: startButtonOpacity == 1 ? `opacity ${blinkInterval}s ease-out` : `opacity ${blinkInterval}s ease`, 
                        fontSize: ready ? "7vh" : "4vh"
                    }}
                    onClick={handleStartGame}
                >
                    {ready ? "Start Game" : "Downloading Assets..." }
                </button>
                <div className="main-view-buttons-wrapper">
                    <button style={{backgroundImage: `url(${githubBackground})`}} onClick={handleGithubClick}></button>
                    <button style={{backgroundImage: `url(${instructionsBackground})`}} onClick={handleInstructionsClick}></button>
                    <button style={{backgroundImage: user ? `url(${loginBackgroundFilled})` : `url(${loginBackground})`}} onClick={handleLoginClick}></button>
                </div>
                <div className="progress-bar" ref={progressBarRef} style={{
                    width: progressBarWidth + "vw", 
                    filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`,
                    transition: `opacity ${blinkInterval}s ease-out, width 0.5s linear`}}
                ></div>
                <div className="loading-video-wrapper">
                    <div className="loading-video">
                        <ReactPlayer url={loadingVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}} onReady={handleVideoReady}></ReactPlayer>
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

