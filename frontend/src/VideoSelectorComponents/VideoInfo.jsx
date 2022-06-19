import React, { useEffect, useRef, useState } from 'react';
import "../styles/VideoInfo.css"
import thumbnailFrame from "../images/video-thumbnail-frame.png"
import highScoreBackground from "../images/high-score.png"
import aTier from "../images/a-tier.png"
import bTier from "../images/b-tier.png"
import cTier from "../images/c-tier.png"
import fTier from "../images/f-tier.png"
import sTier from "../images/s-tier.png"
import naTier from "../images/na-tier.png"
import ReactPlayer from 'react-player';

const VideoInfo = ({ videoInfo, settingsObj, onMount, user, highScoreObj }) => {

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
        if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "max") {
            currentResRef.current = "high"
            setThumbnailSrc(`https://img.youtube.com/vi/${videoInfo.id.videoId}/hqdefault.jpg`)
        } else if (thumbnailImgRef.current.naturalHeight == 90 && currentResRef.current == "high") {
            currentResRef.current = "default"
            setThumbnailSrc(videoInfo.snippet.thumbnails.high.url)
        }
    }

    useEffect(() => {
        console.log(user)
    }, [highScoreObj, user])

    return (videoInfo.snippet.thumbnails.high.url != "" ? 
            <div className="video-info-wrapper">
                <div className="video-tier" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                    {
                        (user && highScoreObj[videoInfo.id.videoId] && highScoreObj[videoInfo.id.videoId].tier) ?
                        <img src={
                            {
                                S: sTier,
                                A: aTier,
                                B: bTier,
                                C: cTier,
                                F: fTier,
                            }[highScoreObj[videoInfo.id.videoId].tier]
                        } alt="tier"></img> :
                        ""
                    }
                </div>
                <div className="video-high-score" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
                    <img src={highScoreBackground} alt="high-score"></img>
                    <h4>{user ? "High Score" : "Login To View High Score"}</h4>
                    <h3>{(user && highScoreObj[videoInfo.id.videoId] && Number(highScoreObj[videoInfo.id.videoId].score) > 0) ? String(highScoreObj[videoInfo.id.videoId].score).padStart(12, "0") : "000000000000"}</h3>
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
                                        volume={0.4}
                                        loop={true}
                                    />
                                </div>
                            </div>
                            <img className="video-thumbnail-frame" src={thumbnailFrame} alt="frame"></img> 
                        </div>  
                            : 
                        <div className="video-thumbnail-wrapper" style={{filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}> 
                            <img className="video-thumbnail-frame" src={thumbnailFrame} alt="frame"></img> 
                        </div>
                    ) 
                    : 
                    <div className="video-thumbnail-wrapper" style={{filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}>      
                        <img className="video-thumbnail-img" ref={thumbnailImgRef} src={thumbnailSrc} onLoad={handleInvalidThumbnailImg} alt="thumbnail"></img>
                        <img className="video-thumbnail-frame" src={thumbnailFrame} alt="frame"></img> 
                    </div>
                } 
            </div>:
            ""
    );
};

export default VideoInfo;