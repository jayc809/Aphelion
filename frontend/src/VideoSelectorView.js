import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import axios from "axios"
import dummyVideoInfo from "./dummyVideoInfo.json"
import ScrollList from './VideoSelectorComponents/ScrollList'
import VideoInfo from './VideoSelectorComponents/VideoInfo'
import SettingsList from './VideoSelectorComponents/SettingsList'
import TransitionInView from './utilComponents/TransitionInView'
import TransitionOutView from './utilComponents/TransitionOutView'
import searchBarBackground from "./images/search-bar.png"
import ytLogo from "./images/yt-logo.png"
import "./VideoSelectorView.css"
import "./App.css"

const VideoSelectorView = ({ setView, setVideoInfoRef, settingsObj, setSettingsObj, user, highScoreObj, setHighScoreObj }) => {

    const searchKeywordRef = useRef("ghost suisei")
    const [videos, setVideos] = useState([])
    const [selectedVideo, setSelectedVideo] = useState({snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}})
    const lastSubmittedSearchKeywordRef = useRef(null)
    const [showYT, setShowYT] = useState(true)
    const inputRef = useRef(null)
    const backgroundVideo = "https://www.youtube.com/watch?v=jH1LBL_v7Qs"

    const [showView, setShowView] = useState(false)
    useEffect(() => {
        getHighScores()
        window.addEventListener("keypress", handleKeyPress)
        setVideos(dummyVideoInfo.items)
        hideSettings() //?
        if (localStorage.getItem("game-background")) {
            localStorage.removeItem("game-background")
        }
        const checkEmptyInput = setInterval(() => {
            const inputEl = document.getElementById("search-input-el")
            if (inputEl.value == "" && document.activeElement != inputEl) {
                setShowYT(true)
            } else {
                setShowYT(false)
            }
        }, 100);
        setTimeout(() => {
            setShowView(true)
        }, 700);
        return () => {
            window.removeEventListener("keypress", handleKeyPress)
            clearInterval(checkEmptyInput)
        }
    }, [])

    const blinkInterval = 1.2
    const [searchTextOpacity, setSearchTextOpacity] = useState(1)
    useEffect(() => {
        if (!showYT) {
            setSearchTextOpacity(1)
        }
        else if (searchTextOpacity <= 1 && searchTextOpacity > 0) {
            const blink = setInterval(() => {
                if (searchTextOpacity == 1) {
                    setSearchTextOpacity(0.2)
                } else {
                    setSearchTextOpacity(1)
                }
            }, blinkInterval * 1000)
            return () => {
                clearInterval(blink)
            }
        }
    }, [searchTextOpacity, showYT])

    const handleKeyPress = (e) => {
        if (e.key == "Enter" && document.getElementById("search-input-el") == document.activeElement) {
            handleSearchSubmit()
        } 
    }

    const handleSearchInputChange = (e) => {
        searchKeywordRef.current = e.target.value
    }

    const [viewKey, setViewKey] = useState(0)

    const handleSearchSubmit = () => {
        if (searchKeywordRef.current == lastSubmittedSearchKeywordRef.current) {
            return  
        }
        lastSubmittedSearchKeywordRef.current = searchKeywordRef.current
        
        hideSettings()

        let firstSearchResult = []
        let secondSearchResult = []
        axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                key: "AIzaSyBDJAkuO_5rZovFS6DNIrEKMziVx4vlBmw",
                q: searchKeywordRef.current,
                type: "video",
                maxResults: 50,
                videoDimension: "2d",
            }
        })
        .then(response => {
            firstSearchResult = response.data.items
        })
        .then(() => {
            let videoIds = firstSearchResult[0].id.videoId
            firstSearchResult.slice(1, firstSearchResult.length).forEach((info) => {
                videoIds += "," + info.id.videoId.toString()
            })
            axios.get("https://www.googleapis.com/youtube/v3/videos", {
                params: {
                    part: "snippet, contentDetails",
                    key: "AIzaSyBDJAkuO_5rZovFS6DNIrEKMziVx4vlBmw",
                    id: videoIds,
                }
            })
            .then((response) => {
                response.data.items.forEach((info) => {
                    const snippet = JSON.parse(JSON.stringify(info.snippet))
                    const duration = info.contentDetails.duration
                    const hours = /\d+(?=H)/.exec(duration)
                    const minutes = parseInt(/\d+(?=M)/.exec(duration))
                    const seconds = parseInt(/\d+(?=S)/.exec(duration))
                    let durationString = null
                    if (hours == null) {
                        if (minutes != null && minutes <= 5 && minutes >= 1) {
                            if (!Number.isNaN(seconds)) {
                                if (Math.floor(seconds / 10) == 0) {
                                    durationString = minutes.toString() + ":0" + seconds.toString()
                                } else {
                                    durationString = minutes.toString() + ":" + seconds.toString()
                                }
                            } else {
                                durationString = minutes.toString() + ":00"
                            }
                        }
                    }
                    if (durationString != null) {
                        snippet.duration = durationString
                        const videoId = info.id
                        secondSearchResult.push({id: {videoId: videoId}, snippet: snippet})
                    }
                })
                return secondSearchResult
            })
            .then(async (secondSearchResult) => { 
                if (user != "") {
                    await getHighScores()
                } 
                setVideos(secondSearchResult)
                setViewKey(viewKey + 1)
                inputRef.current.value = lastSubmittedSearchKeywordRef.current
                unfocusInput()
            })
        })
    }

    const getHighScores = async () => {
        fetch("/get-high-scores-user", {
            method: 'POST', 
            mode: 'cors', 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: user
            }) 
        })
        .then(res => {
            return res.json()
        }) 
        .then(res => {
            setHighScoreObj(res.highScoreObj)
        })   
    }

    const unfocusInput = () => {
        const temp = document.createElement("input");
        document.body.appendChild(temp);
        temp.focus();
        document.body.removeChild(temp);
    }

    const settingsShowingRef = useRef(false)
    const scrollListRef = useRef(null)
    const selectedVideoRef = useRef(null)
    const settingsRef = useRef(null)
    const animationTime = 0.3
    const setUseVideoRef = useRef(null)
    const setVideoPlayRef = useRef(null)
    const onVideoInfoMount = (setUseVideo, setPlay) => {
        setUseVideoRef.current = setUseVideo
        setVideoPlayRef.current = setPlay
    }
    
    const [nextButtonText, setNextButtonText] = useState("Continue")
    const [backButtonText, setBackButtonText] = useState("Exit")
    const showSettings = () => {
        if (!settingsShowingRef.current) {    
            scrollListRef.current.style.animation = `hide-scroll-list ${animationTime}s ease-out forwards`
            selectedVideoRef.current.style.animation = `hide-selected-video ${animationTime}s ease-out forwards`
            setNextButtonText("Start")
            setBackButtonText("Back")
            setUseVideoRef.current(true)
            setTimeout(() => {
                settingsRef.current.style.animation =  `show-settings ${animationTime}s ease-out forwards`
                settingsShowingRef.current = true
            }, (animationTime * 0.4) * 1000)
        }
    }

    const hideSettings = () => {
        if (settingsShowingRef.current) {   
            settingsRef.current.style.animation =  `hide-settings ${animationTime}s ease-out forwards`
            setUseVideoRef.current(false)
            setNextButtonText("Continue")
            setBackButtonText("Exit")
            setTimeout(() => {  
                scrollListRef.current.style.animation = `show-scroll-list ${animationTime}s ease-out forwards`
                selectedVideoRef.current.style.animation = `show-selected-video ${animationTime}s ease-out forwards`
                settingsShowingRef.current = false
            }, (animationTime * 0.4) * 1000)
        }
    }

    const handleBackButtonClick = () => {
        if (settingsShowingRef.current) {
            hideSettings()
        } else {
            nextViewDestinationRef.current = "main"
            setTransitionOut(true)
            setVideoPlayRef.current(false)
        }
    }
    
    const [transitionOut, setTransitionOut] = useState(false)
    const nextViewDestinationRef = useRef(null)
    const handleNextButtonClick = () => {
        if (selectedVideo.snippet.title == "") {
            return
        }
        if (!settingsShowingRef.current) {
            showSettings()
        } else {
            if (!settingsObj.useVideoForBackground && !localStorage.getItem("game-background")) {
                const temp = settingsObj
                temp.useVideoForBackground = true
                setSettingsObj(temp)
            }
            setVideoInfoRef(selectedVideo)
            nextViewDestinationRef.current = "analyzer"
            setTransitionOut(true)
            setVideoPlayRef.current(false)
        }
    }
    const nextViewAnalyzer = () => {
        setView("analyzer")
    }
    const nextViewMain = () => {
        setView("main")
    }

    const focusInput = () => {
        document.getElementById("search-input-el").focus()
    }

    return (
        <div className="screen-wrapper">
            <TransitionInView delay={1} settingsObj={settingsObj}></TransitionInView>
            <TransitionOutView nextView={
                nextViewDestinationRef.current == "analyzer" ? nextViewAnalyzer : nextViewMain
            } start={transitionOut} settingsObj={settingsObj}></TransitionOutView>
            <div className="video-selector-view-wrapper" key={viewKey} style={{opacity: showView ? 1 : 0}}>
                <div>
                    <div className="search-bar" style={{cursor: "pointer"}}>
                        <img className="search-bar-background" src={searchBarBackground} alt="search-bar"></img>
                        {showYT ? <div className="search-YT" onClick={focusInput} style={{
                            opacity: searchTextOpacity,
                            transition: searchTextOpacity == 1 ? `opacity ${blinkInterval}s ease-out` : `opacity ${blinkInterval}s ease`, 
                         }}>Search</div> : ""}
                        {showYT ? <img className="search-YT-logo" src={ytLogo} alt="yt-logo" onClick={focusInput} style={{
                            opacity: searchTextOpacity,
                            transition: searchTextOpacity == 1 ? `opacity ${blinkInterval}s ease-out` : `opacity ${blinkInterval}s ease`, 
                        }}></img> : ""}
                        <input className="search-input" id="search-input-el" ref={inputRef} type="text" onChange={handleSearchInputChange} onFocus={() => {setShowYT(false)}} onClick={focusInput} autoComplete="off"></input>
                    </div>

                    <div className="video-selected" ref={selectedVideoRef} 
                        style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}
                    >
                        <div className="scroll-list-block-background-1"></div>
                        <div className="scroll-list-block-background-2"></div>
                        <div className="scroll-list-block-background-3"></div>
                        <div className="scoll-list-text-wrapper">
                            <div className="video-selected-title-text">
                                {selectedVideo.snippet.title}
                            </div>
                            <div className="video-selected-artist-text">
                                {selectedVideo.snippet.channelTitle != "" ? "- " + selectedVideo.snippet.channelTitle : ""}
                            </div>
                            <div className="video-selected-duration-text">
                                {selectedVideo.snippet.duration} 
                            </div>
                        </div>
                    </div>

                    <div className="settings" ref={settingsRef}>
                        <SettingsList settingsObj={settingsObj} setSettingsObj={setSettingsObj} selectedVideo={selectedVideo}></SettingsList>
                    </div>

                    <div className="scroll-list" ref={scrollListRef} style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                        <ScrollList videosInput={videos} setSelectedVideo={setSelectedVideo}/>
                    </div>

                    <div className="video-info">
                        <VideoInfo videoInfo={selectedVideo} settingsObj={settingsObj} onMount={onVideoInfoMount} user={user} highScoreObj={highScoreObj}/>
                    </div>

                    <div className="video-buttons" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                        <button className="back-button" onClick={handleBackButtonClick} style={{cursor: "pointer"}}>{backButtonText}</button>
                        <button className="next-button" onClick={handleNextButtonClick} style={{cursor: "pointer"}}>{nextButtonText}</button>
                    </div>

                    <div className="background-video-wrapper"> 
                        <div className="background-video" >
                            <ReactPlayer url={backgroundVideo} width="100%" height="100%" playing={true} loop={true} muted={true} style={{ pointerEvents: "none"}}></ReactPlayer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoSelectorView