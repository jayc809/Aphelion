import React, { useEffect, useState } from 'react'

const AnimationView = ({ height, width, dirName, start, end, elapseTime }) => {

    const [frameCount, setFrameCount] = useState(start)
    const [showView, setShowView] = useState(true)

    useEffect(() => {
        const frameCounter = setInterval(() => {
            if (frameCount < end) {
                setFrameCount(frameCount + 1)
            } else {
                setShowView(false)
            }
        }, elapseTime * 1000 / (end - start + 1))
        return () => {
            clearInterval(frameCounter)
        }
    })

    return ( 
        showView ? 
        <div style={{height: height, width: width, border: "1px solid red"}}>
            <img src={require(`./animations/${dirName}/${dirName}-${String(frameCount).padStart(2, "0")}.png`)} style={{height: "100%", width: "100%", objectFit: "contain"}}></img>
        </div> : 
        ""
    )
}

export default AnimationView