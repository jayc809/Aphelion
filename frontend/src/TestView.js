import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import HoldTile from './GameViewComponents/HoldTile';
import Platform from './GameViewComponents/Platform';
import CircleProgressBar from './ResultsViewComponents/CircleProgressBar'
import "./GameView.css"

const TestView = () => {

    const videoId = "tuZty35Fk7M"
    const imgRef = useRef(null)
    const [thumbnailSrc, setThumbnailSrc] = useState(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
    const defaultThumbnailSrc = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    const handleImgValidity = () => {
        if (imgRef.current.naturalHeight == 90) {
            setThumbnailSrc(defaultThumbnailSrc)
        }
    }

    return (
        <div>      
            <CircleProgressBar size={"30vh"} numerator={260} denominator={300} delay={1} duration={1}/>
        </div>
    )
}

export default TestView;