import React, { useEffect, useRef, useState } from 'react';
import "./ResultsView.css"
import CircleProgressBar from './ResultsViewComponents/CircleProgressBar';
import TransitionInView from './TransitionInView';
import resultsBackground from "./images/results-background.png"
import resultsTop from "./images/results-top.png"
import aTier from "./images/a-tier.png"

const ResultsView = ({ resultsObj, settingsObj, videoInfo }) => {

    const [clipRight, setClipRight] = useState(null)
    const [clipLeft, setClipLeft] = useState(null)
    const [thumbnailSrc, setThumbnailSrc] = useState(null)
    const thumbnailImgRef = useRef(null)
    const currentResRef = useRef("max")

    useEffect(() => {
        setClips()
        setThumbnailSrc(`https://img.youtube.com/vi/${videoInfo.id.videoId}/maxresdefault.jpg`)
        window.addEventListener("resize", setClips)
        return () => {
            window.removeEventListener("resize", setClips)
        }
    }, [])

    const handleInvalidThumbnailImg = () => {
        console.log(thumbnailImgRef.current.naturalHeight)
        if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "max") {
            currentResRef.current = "high"
            setThumbnailSrc(`https://img.youtube.com/vi/${videoInfo.id.videoId}/hqdefault.jpg`)
        } else if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "high") {
            currentResRef.current = "default"
            setThumbnailSrc(videoInfo.snippet.thumbnails.high)
        }
    }

    const setClips = () => {
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
        } else {
            const lowerRight = window.innerHeight - ((outerWidth - window.innerWidth) / 2) / Math.tan(lineAngle)
            const upperRight = window.innerWidth - (window.innerHeight * Math.tan(lineAngle) - ((outerWidth - window.innerWidth) / 2))
            const lowerLeft = ((window.innerHeight * 466 / 800) * Math.tan(lineAngle)) - ((outerWidth - window.innerWidth) / 2)
            const upperLeft = window.innerHeight - lowerLeft / Math.tan(lineAngle)
            setClipRight(`polygon(100vw 0vh, 100vw ${lowerRight}px, ${upperRight}px 0vh)`)
            setClipLeft(`polygon(0vw 100vh, ${lowerLeft}px 100vh, 0vw ${upperLeft}px)`)
        }
    }

    const formatScore = () => {
        return String(resultsObj.score).padStart(12, '0')
    }

    return (
        <div className="screen-wrapper">
            <TransitionInView delay={1} settingsObj={settingsObj}></TransitionInView>
            <div className="results-view-wrapper">
                <button className="results-next-button" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                    Continue
                </button>
                <button className="results-back-button" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                    Retry
                </button>
                <div className="results-main-content">
                    <div className="results-tier-wrapper">
                        <h4>Rank</h4>
                        <img src={aTier}></img>
                    </div>
                    <div className="results-metrics-wrapper">
                        <h4>Score</h4>
                        <h2>{formatScore()}</h2>
                        <div className="results-circle-wrapper">
                            <CircleProgressBar size={"calc(75vw * 0.6 / 2.2)"} numerator={260} denominator={300} delay={1.7} duration={1}></CircleProgressBar>
                            <CircleProgressBar size={"calc(75vw * 0.6 / 2.2)"} numerator={260} denominator={300} delay={1.7} duration={1}></CircleProgressBar>
                        </div>
                    </div>
                </div>
                <div className="results-img-right-clip" style={{clipPath: clipRight, filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}>
                    <img className="results-img-right-clip-content" ref={thumbnailImgRef} src={thumbnailSrc}></img>
                </div>
                <div className="results-img-left-clip" style={{clipPath: clipLeft, filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}>
                    <img className="results-img-left-clip-content" src={thumbnailSrc}></img>
                </div>
                <img className="results-view-background" src={resultsBackground} style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}></img>
                <div className="results-view-top">
                    <h3>{videoInfo.snippet.title}</h3>
                    <h4>{videoInfo.snippet.channelTitle}</h4>
                    <img src={resultsTop} style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}></img>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;