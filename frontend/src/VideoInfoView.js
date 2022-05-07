import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import videoInfo from "./videoInfo.json"
import "./VideoInfoView.css"
import "./App.css"

const VideoInfoView = () => {

    const searchKeywordRef = useRef("ghost suisei")
    const [videos, setVideos] = useState([])

    const handleSearchInputChange = (e) => {
        searchKeywordRef.current = e.target.value
    }

    const handleSearchSubmit = () => {
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
        setVideos(videoInfo.items)
    }

    return (
        <div className="video-info-view-wrapper">
            <div className="search-bar-wrapper">
                <input className="search-input" type="text" onChange={handleSearchInputChange}></input>
                <button className="search-button" onClick={handleSearchSubmit}>Search</button>
            </div>
            <ul className="video-display-wrapper">
                {
                    videos.map((videoSnippet, index) => {
                        return <li key={index}>{videoSnippet.snippet.title} - {videoSnippet.snippet.channelTitle}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default VideoInfoView