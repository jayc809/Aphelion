import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile-hold.png"
import barImage from "../images/hold-bar.png"

const HoldTile = ({ type, tileSpeed, targetBeatNumber, elaspedTime, onMount, onMiss, id }) => {

    const tileRef = useRef(null)
    const barRef = useRef(null)
    const barClipRef = useRef(null)
    const barClipTapRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const timingFunctionOpacity = "cubic-bezier(0.0, 0.7, 0.0, 0.9)"
    const [state, setState] = useState(1)
    const tapPositionY = useRef(null)
    const [barHeight, setBarHeight] = useState(null)

    //initializations
    useEffect(() => {
        if (type != "placeholder") {
            onMount(type, targetBeatNumber, controller)
        }
        window.addEventListener("keydown", tapTile)
        return () => {window.removeEventListener("keydown", tapTile)}
    }, [])

    const controller = (instructions, options = null) => {
        switch (instructions) {
            case "setState":
                setState(options)
                break
            case "pauseAnimation":
                tileRef.current.style.animationPlayState = "paused"
                break
            case "playAnimation":
                tileRef.current.style.animationPlayState = "running"
                break
        }
    }

    useEffect(() => {
        switch (state) {
            case 1:
                loadTile()
                break
            case 2:
                tapTile()
                break
            case 3:
                unloadTile()
                break
        }
    }, [state])

    const getBarHeight = () => {
        if (tileSpeed <= elaspedTime) {
            return window.innerHeight * 0.6 / tileSpeed * elaspedTime
        } else {

        }
    }

    useEffect(() => {
        const bar = barRef.current
        bar.style.height = barHeight + "px"
    }, [barHeight])

    const loadTile = () => {
        setBarHeight(getBarHeight())
        const bar = barRef.current
        const tile = tileRef.current
        const barClip = barClipRef.current
        if (type == "placeholder") {
            tile.style.opacity = 0
        } else {
            switch (type) {
                case "left":
                    barClip.style.clipPath = "polygon(47.2vw 40vh, 46.8vw 40vh, 21.6vw 100vh, 26.6vw 100vh)"
                    break
                case "middle-left":
                    barClip.style.clipPath = "polygon(49.2vw 40vh, 48.8vw 40vh, 39vw 100vh, 44vw 100vh)"
                    break
                case "middle-right":
                    barClip.style.clipPath = "polygon(51.3vw 40vh, 50.9vw 40vh, 56.1vw 100vh, 61.1vw 100vh)"
                    break
                case "right":
                    barClip.style.clipPath = "polygon(53.3vw 40vh, 52.9vw 40vh, 73.5vw 100vh, 78.5vw 100vh)"
                    break
            }
            
            tile.style.animation = `move-x-${type} ${tileSpeed + "s"} ${timingFunctionMove}, 
                                    move-y ${tileSpeed + "s"} ${timingFunctionMove},
                                    increase-size-tile ${tileSpeed + "s"} ${timingFunctionMove},
                                    increase-opacity ${tileSpeed + "s"} ${timingFunctionOpacity}`
            bar.style.animation = `move-y-bar ${tileSpeed + "s"} ${timingFunctionMove}`
        }
    }

    const tapTile = () => {
        const tile = tileRef.current
        tile.style.animationPlayState = "paused"
        const tileBox = tile.getBoundingClientRect()
        tapPositionY.current = tileBox.top + tileBox.height / 2
        const barClipTap = barClipTapRef.current
        barClipTap.style.clipPath = `polygon(100vw 0px, 0px 0px, 0px ${tapPositionY.current}px, 100vw ${tapPositionY.current}px)`
        const bar = barRef.current
        bar.style.backgroundColor = "red"
        bar.style.animation = "none"
        bar.style.bottom = (window.innerHeight - tapPositionY.current) + "px"
        bar.style.animation = `move-y-bar-tapped ${elaspedTime + "s"} linear`
    }

    const unloadTile = () => {
        const tile = tileRef.current
        tile.style.animation = "none"
        tile.style.opacity = 0
        setState(4)
    }

    const handleMiss = () => {
        onMiss(type, targetBeatNumber)
        setState(3)
    }

    const handleFinish = () => {
        if (state != 3) {
            setState(3)
        }
    }

    return (
        state != 4 ? 
        <div className="tile-wrapper" style={{zIndex: id}}>
            <div className="tile" ref={tileRef} onAnimationEnd={handleMiss}>
                <img 
                    src={tileImage} 
                    alt="tile"
                />
            </div>
            <div className="bar-clip-tap" ref={barClipTapRef}>
                <div className="bar-clip" ref={barClipRef}>
                    <div className="bar" ref={barRef} onAnimationEnd={handleFinish}>
                        <style>{`
                            @keyframes move-y-bar-tapped {
                                from { 
                                    bottom: ${tapPositionY.current}px; 
                                    opacity: 1;
                                }
                                to { 
                                    bottom: calc(${tapPositionY.current - barHeight + window.innerHeight * 0.135}px);
                                    opacity: 1;
                                }
                            }
                        `}</style>
                        <img    
                            src={barImage} 
                            alt="bar"
                        />
                    </div>
                </div>
            </div>
        </div> :
        ""
    )
    
}

export default HoldTile