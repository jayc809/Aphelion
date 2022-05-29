import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import axios from "axios"
import dummyVideoInfo from "./dummyVideoInfo.json"
import ScrollList from './VideoSelectorComponents/ScrollList'
import VideoInfo from './VideoSelectorComponents/VideoInfo'
import SettingsList from './VideoSelectorComponents/SettingsList'
import searchBarBackground from "./images/search-bar.png"
import ytLogo from "./images/yt-logo.png"
import bg from "./images/video-selector-bg.png"
import "./VideoSelectorView.css"
import "./App.css"

const VideoSelectorView = () => {

    const searchKeywordRef = useRef("ghost suisei")
    const [videos, setVideos] = useState([])
    const [selectedVideo, setSelectedVideo] = useState({snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}})
    const lastSubmittedSearchKeywordRef = useRef(null)
    const [showYT, setShowYT] = useState(true)
    const backgroundVideo = "https://www.youtube.com/watch?v=jH1LBL_v7Qs"

    useEffect(() => {
        window.addEventListener("keypress", handleKeyPress)
        setVideos(dummyVideoInfo.items)
        const checkEmptyInput = setInterval(() => {
            if (document.getElementById("search-input-el").value == "") {
                setShowYT(true)
            } else {
                setShowYT(false)
            }
        }, 100);
        return () => {
            window.removeEventListener("keypress", handleKeyPress)
            clearInterval(checkEmptyInput)
        }
    }, [])

    const handleKeyPress = (e) => {
        if (e.key == "Enter") {
            handleSearchSubmit()
        } else {
            document.getElementById("search-input-el").focus()
        }
    }

    const handleSearchInputChange = (e) => {
        searchKeywordRef.current = e.target.value
    }

    const handleSearchSubmit = () => {
        if (searchKeywordRef.current == lastSubmittedSearchKeywordRef.current) {
            return  
        }
        lastSubmittedSearchKeywordRef.current = searchKeywordRef.current
        // axios.get("https://www.googleapis.com/youtube/v3/search", {
        //     params: {
        //         part: "snippet",
        //         key: "AIzaSyBDJAkuO_5rZovFS6DNIrEKMziVx4vlBmw",
        //         q: searchKeywordRef.current,
        //         type: "video",
        //         maxResults: 50,
        //         videoDimension: "2d",
        //         videoEmbeddable: true,
        //         videoSyndicated: true,
        //     }
        // })
        // .then(response => {
        //     setVideos(response.data.items)
        // })
        setVideos(dummyVideoInfo.items)
    }

    const settingsShowingRef = useRef(false)
    const scrollListRef = useRef(null)
    const selectedVideoRef = useRef(null)
    const settingsRef = useRef(null)
    const animationTime = 0.3
    const setUseVideoRef = useRef(null)

    const onVideoInfoMount = (setUseVideo) => {
        setUseVideoRef.current = setUseVideo
    }

    const showSettings = () => {
        scrollListRef.current.style.animation = `hide-scroll-list ${animationTime}s ease-out forwards`
        selectedVideoRef.current.style.animation = `hide-selected-video ${animationTime}s ease-out forwards`
        setUseVideoRef.current(true)
        setTimeout(() => {
            settingsRef.current.style.animation =  `show-settings ${animationTime}s ease-out forwards`
            settingsShowingRef.current = true
        }, (animationTime * 0.4) * 1000)
    }

    const hideSettings = () => {
        settingsRef.current.style.animation =  `hide-settings ${animationTime}s ease-out forwards`
        setUseVideoRef.current(false)
        setTimeout(() => {  
            scrollListRef.current.style.animation = `show-scroll-list ${animationTime}s ease-out forwards`
            selectedVideoRef.current.style.animation = `show-selected-video ${animationTime}s ease-out forwards`
            settingsShowingRef.current = false
        }, (animationTime * 0.4) * 1000)
    }

    const handleBackButtonClick = () => {
        if (settingsShowingRef.current) {
            hideSettings()
        }
    }
    
    const handleNextButtonClick = () => {
        if (!settingsShowingRef.current) {
            showSettings()
        }
    }

    const [settingsObj, setSettingsObj] = useState({
        difficulty: "Hard",
        tileSpeed: 1.3,
        theme: "dark",
        uiHue: 0,
        uiSaturation: 1.6,
        uiBrightness: 1.0,
        videoSaturation: 2.0,
        videoBrightness: 0.8,
        smoothAnimations: true,
        beatNotes: true,
        lowerVolumeOnMisses: false
    })

    return (
        <div className="video-selector-view-wrapper">
            <div className="search-bar">
                <input className="search-input" id="search-input-el" type="text" onChange={handleSearchInputChange} autoComplete="off"></input>
                <img className="search-bar-background" src={searchBarBackground}></img>
                {showYT ? <div className="search-YT">Search</div> : ""}
                {showYT ? <img className="search-YT-logo" src={ytLogo}></img> : ""}
            </div>

            <div className="video-selected" ref={selectedVideoRef} style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                <button className="video-selected-button">
                </button>
                <button className="video-selected-title-text">
                    {selectedVideo.snippet.title}
                </button>
                <button className="video-selected-artist-text">
                    {"- " + selectedVideo.snippet.channelTitle}
                </button>
            </div>

            <div className="settings" ref={settingsRef}>
                <SettingsList settingsObj={settingsObj} setSettingsObj={setSettingsObj}></SettingsList>
            </div>

            <div className="scroll-list" ref={scrollListRef} style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                <ScrollList videosInput={videos} setSelectedVideo={setSelectedVideo}/>
            </div>

            <div className="video-info">
                <VideoInfo videoInfo={selectedVideo} settingsObj={settingsObj} onMount={onVideoInfoMount}/>
            </div>

            <div className="video-buttons" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                <button className="back-button" onClick={handleBackButtonClick}>Back</button>
                <button className="next-button" onClick={handleNextButtonClick}>Next</button>
            </div>

            <div className="background-video-wrapper"> 
                <div className="background-video" >
                    <ReactPlayer url={backgroundVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}}></ReactPlayer>
                </div>
            </div>
        </div>
    )
}

export default VideoSelectorView