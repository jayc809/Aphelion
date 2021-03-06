import React, { useEffect, useState } from 'react'

const AnimationViewContained = ({dirName, start, end, loop, loopStart, onComplete }) => {

    const [frameCount, setFrameCount] = useState(start)
    const [showView, setShowView] = useState(true)
    
    useEffect(() => {
        const frameCounter = setInterval(() => {
            if (!loop) {
                if (frameCount < end) {
                    setFrameCount(frameCount + 1)
                } else {
                    clearInterval(frameCounter)
                    setShowView(false)
                    onComplete()
                }
            } else {
                if (frameCount < end) {
                    setFrameCount(frameCount + 1)
                } else {
                    setFrameCount(loopStart)
                }
            }
        }, 20)
        return () => {
            clearInterval(frameCounter)
        }
    }, [frameCount])

    return ( 
        showView ? 
        <div style={{height: "100%", width: "100%", overflow: "hidden"}}>
            <img src={`/animation?dirName=${dirName}&index=${frameCount}`} style={{height: "100%", width: "100%", objectFit: "contain"}} alt={`${dirName}-animation`}></img>
        </div> : 
        ""
    )
}

export default AnimationViewContained