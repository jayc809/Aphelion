import React, { useEffect, useRef, useState } from 'react';
import "./ResultsView.css"
import CircleProgressBar from './ResultsViewComponents/CircleProgressBar';
import TransitionInView from './utilComponents/TransitionInView';
import TransitionOutView from './utilComponents/TransitionOutView';
import ReactPlayer from 'react-player';
import resultsBackground from "./images/results-background.png"
import resultsTop from "./images/results-top.png"
import noMisses from "./images/no-misses.png"
import fullCombo from "./images/full-combo.png"
import fullPerfect from "./images/full-perfect.png"
import sTier from "./images/s-tier.png"
import aTier from "./images/a-tier.png"
import bTier from "./images/b-tier.png"
import cTier from "./images/c-tier.png"
import fTier from "./images/f-tier.png"

const ResultsView = ({ setView, incrementGameId, resultsObj, settingsObj, videoInfo, user, highScoreObj }) => {

    const [clipRight, setClipRight] = useState(null)
    const [clipLeft, setClipLeft] = useState(null)
    const [circleSize, setCircleSize] = useState(null)
    const [signSize, setSignSize] = useState(null)
    const [thumbnailSrc, setThumbnailSrc] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)
    const startAddingScore = useRef(false)
    const thumbnailImgRef = useRef(null)
    const currentResRef = useRef("max")
    const tierRef = useRef(null)
    const retryButtonRef = useRef(null)
    const conitnueButtonRef = useRef(null)
    const backgroundVideo = "https://www.youtube.com/watch?v=jH1LBL_v7Qs"

    useEffect(() => {
        updateHighScore()
        handleResize()
        setThumbnailSrc(`https://img.youtube.com/vi/${videoInfo.id.videoId}/maxresdefault.jpg`)
        setTimeout(() => {
            setShowView(true)
        }, 700);
        setTimeout(() => {
            setTimeout(() => {
                tierRef.current.style.animation = "tier-zoom-out 0.5s ease-out forwards"
            }, 500);
            retryButtonRef.current.style.animation = "opacity-0-1 0.7s linear forwards"
            conitnueButtonRef.current.style.animation = "opacity-0-1 0.7s linear forwards"
            startAddingScore.current = true
            setScoreDisplay(1)
        }, 1700);
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const [showNewHighScore, setShowNewHighScore] = useState(false)
    const updateHighScore = () => {
        if ((highScoreObj[videoInfo.id.videoId] && Number(resultsObj.score) > Number(highScoreObj[videoInfo.id.videoId].score)) ||
            !highScoreObj[videoInfo.id.videoId]) {
            setShowNewHighScore(true)
            fetch("https://jayc809-aphelion.com/update-high-scores-user", {
                method: 'POST', 
                mode: 'cors', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: user,
                    videoId: videoInfo.id.videoId,
                    score: resultsObj.score,
                    tier: resultsObj.tier
                }) 
            })
        } else {
            setShowNewHighScore(false)
        }
    }

    useEffect(() => {
        if (startAddingScore.current ) {
            const intervals = 30
            setTimeout(() => {
                let currScore = scoreDisplay
                currScore += parseInt(resultsObj.score / intervals)
                if ((resultsObj.score - currScore < parseInt(resultsObj.score / intervals)) ||
                    currScore > resultsObj.score) {
                    setScoreDisplay(resultsObj.score)
                } else {
                    setScoreDisplay(currScore)
                }
            }, 1000 / intervals)
        }
    }, [scoreDisplay])

    const handleInvalidThumbnailImg = () => {
        if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "max") {
            currentResRef.current = "high"
            setThumbnailSrc(`https://img.youtube.com/vi/${videoInfo.id.videoId}/hqdefault.jpg`)
        } else if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "high") {
            currentResRef.current = "default"
            setThumbnailSrc(videoInfo.snippet.thumbnails.high)
        }
    }

    const handleResize = () => {
        const aspectRatio = window.innerWidth / window.innerHeight 
        const outerHeight = window.innerWidth * 800 / 1280
        const outerWidth = window.innerHeight * 1280 / 800
        const lineAngle = 35 * (Math.PI / 180)
        const widthDifference = ((outerHeight - window.innerHeight) / 2) * (Math.tan(lineAngle))
        if (aspectRatio >= 1280 / 800) {
            const lowerLeft = window.innerWidth - widthDifference
            const upperLeft = window.innerWidth - ((outerHeight * Math.tan(lineAngle)) - widthDifference)
            const upperRight = (outerHeight * 334 / 800) - ((outerHeight - window.innerHeight) / 2)
            const lowerRight = ((outerHeight * 466 / 800) * Math.tan(lineAngle)) - widthDifference
            setClipRight(`polygon(100vw 0vh, 100vw 100vh, ${lowerLeft}px 100vh, ${upperLeft}px 0vh)`)
            setClipLeft(`polygon(0vw 100vh, 0vw ${upperRight}px, ${lowerRight}px 100vh)`)
            setCircleSize("calc(67vh / 2.25)")
            setSignSize("calc((67vh / 2.25 + 3.5vw / 2) * 2 / 3)")
        } else {
            const lowerRight = window.innerHeight - ((outerWidth - window.innerWidth) / 2) / Math.tan(lineAngle)
            const upperRight = window.innerWidth - (window.innerHeight * Math.tan(lineAngle) - ((outerWidth - window.innerWidth) / 2))
            const lowerLeft = ((window.innerHeight * 466 / 800) * Math.tan(lineAngle)) - ((outerWidth - window.innerWidth) / 2)
            const upperLeft = window.innerHeight - lowerLeft / Math.tan(lineAngle)
            setClipRight(`polygon(100vw 0vh, 100vw ${lowerRight}px, ${upperRight}px 0vh)`)
            setClipLeft(`polygon(0vw 100vh, ${lowerLeft}px 100vh, 0vw ${upperLeft}px)`)
            setCircleSize("calc(75vw * 0.62 / 2.5)")
            setSignSize("calc((75vw * 0.62 / 2.5 + 3.5vw / 2) * 2 / 3)")
        }
    }

    const [transitionOut, setTransitionOut] = useState(false)
    const nextViewDestinationRef = useRef(null)
    const handleContinue = () => {
        nextViewDestinationRef.current = "videos"
        setTransitionOut(true)
    }
    const nextViewVideos = () => {
        setView("videos")
    }

    const handleRetry = () => {
        nextViewDestinationRef.current = "game"
        incrementGameId()
        setTransitionOut(true)
    }
    const nextViewGame = () => {
        setView("game")
    }

    const [showView, setShowView] = useState(false)

    const getTierSrc = () => {
        switch (resultsObj.tier) {
            case "S":
                return sTier
            case "A":
                return aTier
            case "B":
                return bTier
            case "C":
                return cTier
            case "F":
                return fTier
            default:
                console.log("error in results view")
                break
        }
    }

    return (
        <div className="screen-wrapper">
            <TransitionInView delay={1} settingsObj={settingsObj}></TransitionInView>
            <TransitionOutView nextView={
                nextViewDestinationRef.current == "videos" ? nextViewVideos : nextViewGame
            } start={transitionOut} settingsObj={settingsObj}></TransitionOutView>
            <div className="results-view-wrapper" style={{opacity: showView ? 1 : 0}}>
                <button className="results-next-button" ref={retryButtonRef}onClick={handleContinue} 
                    style={{opacity: 0, filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`, cursor: "pointer"}}
                >
                    Continue
                </button>
                <button className="results-back-button" ref={conitnueButtonRef} onClick={handleRetry} 
                    style={{opacity: 0, filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`, cursor: "pointer"}}
                >
                    Retry
                </button>
                <div className="results-main-content">
                    <div className="results-tier-wrapper">
                        <h4 style={showNewHighScore ? {paddingTop: "0.5vh", transform: "rotate(-4deg)", fontFamily: "Futura", fontSize: "3vh", marginBottom: "-2vh"} : {}}>{showNewHighScore ? "New High Score!" : "Rank"}</h4>
                        <img src={getTierSrc()} ref={tierRef} style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}} alt="tier"></img>
                    </div>
                    <div className="results-metrics-wrapper">
                        <h4>Score</h4>
                        <h2>{String(scoreDisplay).padStart(12, "0")}</h2>
                        <div className="results-sign-wrapper">
                            <img src={noMisses} style={{width: signSize, marginBottom: `calc(${circleSize} / 8)`, opacity: resultsObj.noMisses ? 1 : 0.35}} alt="no-misses"></img>
                            <img src={fullCombo} style={{width: signSize, marginBottom: `calc(${circleSize} / 8)`, opacity: resultsObj.fullCombo ? 1 : 0.5}} alt="full-combo"></img>
                            <img src={fullPerfect} style={{width: signSize, marginBottom: `calc(${circleSize} / 8)`, opacity: resultsObj.fullPerfect ? 1 : 0.4}} alt="full-perfect"></img>
                        </div>
                        <div className="results-circle-wrapper">
                            <div style={{height: `calc(${circleSize} * 1.6)`, width: circleSize}}>
                                <CircleProgressBar size={circleSize} numerator={resultsObj.maxCombo} denominator={resultsObj.totalNotes} delay={1.7} duration={1}></CircleProgressBar>
                                <h4 style={{textAlign: "center", margin: "0", marginTop: `calc(${circleSize} / 8)`, textIndent: `calc(${circleSize} / 30)`}}>Max Combo</h4>
                            </div>
                            <div style={{height: `calc(${circleSize} * 1.6)`, width: circleSize}}>
                                <CircleProgressBar size={circleSize} numerator={resultsObj.totalPerfect} denominator={resultsObj.totalNotes} delay={1.7} duration={1}></CircleProgressBar>
                                <h4 style={{textAlign: "center", margin: "0", marginTop: `calc(${circleSize} / 8)`, textIndent: `calc(${circleSize} / 15)`}}>Perfect Notes</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="results-img-right-clip" style={{clipPath: clipRight, filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}>
                    <img className="results-img-right-clip-content" ref={thumbnailImgRef} src={thumbnailSrc} onLoad={handleInvalidThumbnailImg} alt="right-img"></img>
                </div>
                <div className="results-img-left-clip" style={{clipPath: clipLeft, filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}>
                    <img className="results-img-left-clip-content" src={thumbnailSrc} alt="left-img"></img>
                </div>
                <img className="results-view-background" src={resultsBackground} style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}} alt="bg"></img>
                <div className="results-view-top">
                    <h3>{videoInfo.snippet.title}</h3>
                    <h4>{videoInfo.snippet.channelTitle}</h4>
                    <img src={resultsTop} alt="top"></img>
                </div>
                <div className="background-video-wrapper"> 
                    <div className="background-video" >
                        <ReactPlayer url={backgroundVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}}></ReactPlayer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;