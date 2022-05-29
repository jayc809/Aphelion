import React from 'react';
import "../styles/VideoInfo.css"
import thumbnailFrame from "../images/video-thumbnail-frame.png"
import highScoreBackground from "../images/high-score.png"
import aTier from "../images/a-tier.png"

const VideoInfo = ({ videoInfo }) => {
    return (videoInfo.snippet.thumbnails.high.url != "" ? 
            <div className="video-info-wrapper">
                <div className="video-tier">
                    <img src={aTier}></img>
                </div>
                <div className="video-high-score">
                    <img src={highScoreBackground}></img>
                    <h4>High Score</h4>
                    <h3>0001373928</h3>
                </div>
                <div className="video-thumbnail-wrapper">  
                    <img className="video-thumbnail-img" src={videoInfo.snippet.thumbnails.high.url}></img> 
                    <img className="video-thumbnail-frame" src={thumbnailFrame}></img> 
                </div> 
            </div>:
            ""
    );
};

export default VideoInfo;