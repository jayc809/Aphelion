import React, { useEffect, useState } from 'react';
import "../styles/ScrollList.css"
const ScrollList = ({ videosInput, setSelectedVideo }) => {

    useEffect(() => {
        if (videosInput.length > 0) {
            handleNewVideosInput()
        }
    }, [videosInput])

    const [videos, setVideos] = useState( 
        Array.apply(null, Array(6)).map((nul, index) => {
            return {snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}}
        })
    )

    const handleNewVideosInput = () => {
        setVideos(
            Array.apply(null, Array(3)).map((nul, index) => {
                return {snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}}
            }).concat(
                videosInput
            ).concat(
                Array.apply(null, Array(3)).map((nul, index) => {
                    return {snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}}
                }
            ))
        )
    }

    // const [videos, setVideos] = useState()
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(null)
    useEffect(() => {
        const videoButtonPositionUpdater = setInterval(() => {
            for (let i = 0; i < videos.length; i += 1) {
                const videoButtonInfo = document.getElementById("videoButton" + i).getBoundingClientRect()
                const videoButtonHeight = videoButtonInfo.height
                const videoButtonPosY = videoButtonInfo.y + videoButtonHeight / 2
                if (videoButtonPosY > window.innerHeight / 2 - videoButtonHeight / 2 &&
                    videoButtonPosY <= window.innerHeight / 2 + videoButtonHeight / 2) {
                    setSelectedVideo(videos[i])  
                    setSelectedVideoIndex(i)
                    break
                }
            }
        }, 10)
        return () => {
            clearInterval(videoButtonPositionUpdater)
        }
    }, [videos])

    return (
        <div className="scroll-list-wrapper">
            <ul className="scroll-list-ul">
                {videos.map((videoSnippet, index) => { 
                    return (
                        <button className="scroll-list-button" key={index} id={"videoButton" + index}>
                            {index != selectedVideoIndex && videoSnippet.snippet.title != "" ? 
                                `${videoSnippet.snippet.title} - ${videoSnippet.snippet.channelTitle}` : 
                                ""
                            }
                        </button>
                    )
                })}
            </ul>
        </div>
    );
};

export default ScrollList;