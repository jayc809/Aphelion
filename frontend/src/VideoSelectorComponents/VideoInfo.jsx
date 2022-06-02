import React, { useEffect, useRef, useState } from 'react';
import "../styles/VideoInfo.css"
import thumbnailFrame from "../images/video-thumbnail-frame.png"
import highScoreBackground from "../images/high-score.png"
import aTier from "../images/a-tier.png"
import ReactPlayer from 'react-player';

const VideoInfo = ({ videoInfo, settingsObj, onMount }) => {

    const [useVideo, setUseVideo] = useState(false)
    const [videoId, setVideoId] = useState(null)
    const [play, setPlay] = useState(true)
    const [thumbnailSrc, setThumbnailSrc] = useState(null)
    const thumbnailImgRef = useRef(null)
    const currentResRef = useRef("max")

    useEffect(() => {
        onMount(setUseVideo, setPlay)
    }, [])
    
    useEffect(() => {
        try {
            setVideoId(videoInfo.id.videoId)
            currentResRef.current = "max"
            setThumbnailSrc(`https://img.youtube.com/vi/${videoInfo.id.videoId}/maxresdefault.jpg`)
        } catch {
            setVideoId(null)
        }
    }, [videoInfo])

    const handleInvalidThumbnailImg = () => {
        console.log(thumbnailImgRef.current.naturalHeight)
        if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "max") {
            currentResRef.current = "high"
            setThumbnailSrc(`https://img.youtube.com/vi/${videoInfo.id.videoId}/hqdefault.jpg`)
        } else if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "high") {
            currentResRef.current = "default"
            setThumbnailSrc(videoInfo.snippet.thumbnails.high.url)
        }
    }

    return (videoInfo.snippet.thumbnails.high.url != "" ? 
            <div className="video-info-wrapper">
                <div className="video-tier" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                    <img src={aTier}></img>
                </div>
                <div className="video-high-score" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                    <img src={highScoreBackground}></img>
                    <h4>High Score</h4>
                    <h3>000001373928</h3>
                </div>
                {useVideo ? (
                    videoId != null ?
                        <div className="video-thumbnail-wrapper" style={{filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}> 
                            <div className="video-thumbnail-video-wrapper">
                                <div className="video-thumbnail-video">
                                    <ReactPlayer 
                                        url={`https://www.youtube.com/watch?v=${videoId}`}
                                        playing={play}
                                        style={{pointerEvents: "none"}}
                                        config={{youtube: {playerVars: {start: 60}}}}
                                        width="100%"
                                        height="100%"
                                        volume={0.5}
                                        loop={true}
                                    />
                                </div>
                            </div>
                            <img className="video-thumbnail-frame" src={thumbnailFrame}></img> 
                        </div>  
                            : 
                        <div className="video-thumbnail-wrapper" style={{filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}> 
                            <img className="video-thumbnail-frame" src={thumbnailFrame}></img> 
                        </div>
                    ) 
                    : 
                    <div className="video-thumbnail-wrapper" style={{filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}>      
                        <img className="video-thumbnail-img" ref={thumbnailImgRef} src={thumbnailSrc} onLoad={handleInvalidThumbnailImg}></img>
                        <img className="video-thumbnail-frame" src={thumbnailFrame}></img> 
                    </div>
                } 
            </div>:
            ""
    );
};

export default VideoInfo;