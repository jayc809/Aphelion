import React, { useEffect, useRef, useState } from 'react';
import "../styles/ScrollList.css"
const ScrollList = ({ videosInput, setSelectedVideo }) => {

    useEffect(() => {
        handelResize()
        window.addEventListener("resize", handelResize)
        return () => {
            window.removeEventListener("resize", handelResize)
        }
    }, [])

    const ulRef = useRef(null)
    useEffect(() => {
        if (videosInput.length > 0) {
            ulRef.current.scrollTop = "300px" //document.getElementById("li0").getBoundingClientRect().top
            handleNewVideosInput()
        } 
    }, [videosInput])

    const [videos, setVideos] = useState( 
        Array.apply(null, Array(11)).map((nul, index) => {
            return {snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}}
        })
    )

    const handleNewVideosInput = () => {
        setVideos(
            Array.apply(null, Array(6)).map((nul, index) => {
                return {snippet: {title: "", channelTitle: "", thumbnails: {high: {url: ""}}}}
            }).concat(
                videosInput
            ).concat(
                Array.apply(null, Array(5)).map((nul, index) => {
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
                if (videoButtonPosY > window.innerHeight * 7 / 12 - videoButtonHeight / 2 &&
                    videoButtonPosY <= window.innerHeight * 7 / 12 + videoButtonHeight / 2) {
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

    const [style, setStyle] = useState({})
    const handelResize = () => {
        const aspectRatio = window.innerWidth / window.innerHeight
        //height 150vh / 9 * 0.8/0.2
        //width 100%
        if (aspectRatio > 1108 / 653) {
            
        } else {

        }
    }

    return (
        <div className="scroll-list-wrapper">
            <ul className="scroll-list-ul" ref={ulRef}>
                {videos.map((videoSnippet, index) => { 
                    return (
                        <div className="scroll-list-block" key={index} style={{opacity: index != selectedVideoIndex ? 1 : 0.5}} id={"li" + index}>
                            <div className="scroll-list-block-background-1"></div>
                            <div className="scroll-list-block-background-2"></div>
                            <div className="scroll-list-block-background-3"></div>
                            <div className="scoll-list-text-wrapper">
                                <div className="scroll-list-button-title-text" id={"videoButton" + index}>
                                    {index != selectedVideoIndex && videoSnippet.snippet.title != "" ? 
                                        videoSnippet.snippet.title : 
                                        ""
                                    }
                                </div>
                            </div>
                            <div className="scoll-list-text-wrapper">
                                <div className="scroll-list-button-artist-text">
                                    {index != selectedVideoIndex && videoSnippet.snippet.title != "" ? 
                                        "- " + videoSnippet.snippet.channelTitle :
                                        ""
                                    }
                                </div>
                            </div>
                            <div className="scoll-list-text-wrapper">
                                <div className="scroll-list-button-duration-text">
                                    {index != selectedVideoIndex && videoSnippet.snippet.title != "" ? 
                                        videoSnippet.snippet.duration : 
                                        ""
                                    }
                                </div>
                            </div>
                        </div>
                        // <div className="scroll-list-button-wrapper" key={index} style={style}>
                            
                        // </div>
                    )
                })}
            </ul>
        </div>
    );
};

export default ScrollList;