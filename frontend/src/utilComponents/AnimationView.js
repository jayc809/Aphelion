import React, { useEffect, useState } from 'react'

const AnimationView = ({ height, width, x, y, dirName, start, end, loop, loopStart, onComplete }) => {

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
        <div style={{height: height, width: width, position: "absolute", left: `calc(${x} - ${width} / 2)`, top: `calc(${y} - ${height} / 2)`, overflow: "hidden"}}>
            <img src={require(`../animations/${dirName}/${dirName}-${String(frameCount).padStart(2, "0")}.png`)} style={{height: "100%", width: "100%", objectFit: "contain"}} alt={`${dirName}-animation`}></img>
        </div> : 
        ""
    )
}

export default AnimationView