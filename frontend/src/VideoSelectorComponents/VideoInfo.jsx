import React from 'react';
import "../styles/VideoInfo.css"

const VideoInfo = ({ videoInfo }) => {
    return (
        <div className="video-info-wrapper">
            {
                videoInfo.snippet.thumbnails.high.url != "" ?
                <img className="video-info-thumbnail" src={videoInfo.snippet.thumbnails.high.url}></img> :
                ""
            }
            <div className="video-info-description">
                <p>
                    {
                        videoInfo.snippet.title + "\n" + 
                        videoInfo.snippet.channelTitle + "\n" + 
                        videoInfo.snippet.description
                    }
                </p>
            </div>
        </div>
    );
};

export default VideoInfo;