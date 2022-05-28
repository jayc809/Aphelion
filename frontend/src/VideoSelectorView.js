import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import dummyVideoInfo from "./dummyVideoInfo.json"
import ScrollList from './VideoSelectorComponents/ScrollList'
import VideoInfo from './VideoSelectorComponents/VideoInfo'
import bg from "./images/video-selector-bg.png"
import "./VideoSelectorView.css"
import "./App.css"

const VideoSelectorView = () => {

    const searchKeywordRef = useRef("ghost suisei")
    const [videos, setVideos] = useState([])
    const [selectedVideo, setSelectedVideo] = useState({snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}})
    const lastSubmittedSearchKeywordRef = useRef(null)

    useEffect(() => {
        window.addEventListener("keypress", handleKeyPress)
        setVideos(dummyVideoInfo.items)
        return () => {
            window.removeEventListener("keypress", handleKeyPress)
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


    return (
        <div className="video-selector-view-wrapper">
            {/* <div className="search-bar">
                <input className="search-input" id="search-input-el" type="text" onChange={handleSearchInputChange}></input>
                <button className="search-button" onClick={handleSearchSubmit}>Search</button>
            </div>

            <div className="video-info">
                <VideoInfo videoInfo={selectedVideo}/>
            </div>

            <button className="video-selected">
                {selectedVideo.snippet.title != "" ? 
                    `${selectedVideo.snippet.title} - ${selectedVideo.snippet.channelTitle}` :
                    ""
                }
            </button> */}
            <div className="scroll-list" >
                <ScrollList videosInput={videos} setSelectedVideo={setSelectedVideo}/>
            </div>

            <div className="video-selector-background">
                <img src={bg}></img>
            </div>
        </div>
    )
}

export default VideoSelectorView