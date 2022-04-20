import React, { useEffect, useRef } from 'react'
import videoPlaceholder from "../images/video-placeholder.png"
import "../styles/Video.css"

const Video = ({videoId}) => {

    const [play, setPlay] = React.useState(false);
    const url = play ? 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&disablekb=1&rel=0` : 
    `https://www.youtube.com/embed/${videoId}?disablekb=1&rel=0`
    const blackScreenRef = useRef(null)

    useEffect(() => {
        window.addEventListener("keypress", handlePress)
        return () => {
            window.removeEventListener("keypress", handlePress)
        }
    });

    const handlePress = () => {
        const blackScreen = blackScreenRef.current
        setTimeout(() => blackScreen.style.animation = "fade-out 3s forwards", 1000)
        setPlay(true)
        window.removeEventListener("keypress", handlePress, false)
    }

    return (
        <div className="video-parent">
            <div className="clip-top"></div>
            <div className="clip-bottom"></div>
            <div className="video-wrapper">
                <div className="black-screen" ref={blackScreenRef}></div>
                <iframe 
                    className="video"
                    title="main-video"
                    src={url}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
            {/* <img src={videoPlaceholder} className="video-placeholder" alt="" /> */}
        </div>
        </div>
    );
}

export default Video