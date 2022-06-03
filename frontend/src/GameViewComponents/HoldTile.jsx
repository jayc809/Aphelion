import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile-hold.png"
import barImage from "../images/hold-bar.png"

const HoldTile = ({ type, tileSpeed, targetTime, elapseBeatCount, elapseTime, onMount, onMiss, updateScoreAndCombo, id }) => {

    const tileRef = useRef(null)
    const barRef = useRef(null)
    const barClipRef = useRef(null)
    const barClipTapRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const timingFunctionMoveBar = "cubic-bezier(1.0, 0.9, 1.0, 0.9)"
    const timingFunctionOpacity = "cubic-bezier(0.0, 0.7, 0.0, 0.9)"
    const [isUnloaded, setIsUnloaded] = useState(false)
    const [tapPositionY, setTapPositionY] = useState(null)
    const scoreIncrementer = useRef(null)
    const barHeightRef = useRef(null)

    //initializations
    useEffect(() => {
        if (type != "placeholder") {
            onMount(type, targetTime, controller)
        }
        loadTile()
    }, [])

    const controller = (instructions, options = null) => {
        switch (instructions) {
            case "getClass":
                return "hold"
            case "hold":
                tapTile(options)
                break
            case "release":
                releaseTile()
                break
            case "pauseAnimation":
                tileRef.current.style.animationPlayState = "paused"
                barRef.current.style.animationPlayState = "paused"
                break
            case "playAnimation":
                tileRef.current.style.animationPlayState = "running"
                barRef.current.style.animationPlayState = "running"
                break
        }
    }
    
    const getBarHeight = () => {
        return window.innerHeight * 0.6 * elapseTime / tileSpeed
    }

    const loadTile = () => {
        const bar = barRef.current
        barHeightRef.current = getBarHeight()
        bar.style.height = String(barHeightRef.current) + "px"
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
            bar.style.animation = `move-y-bar ${tileSpeed + "s"} ${timingFunctionMove}, 
                                   increase-opacity-bar ${tileSpeed + "s"} ${timingFunctionOpacity}`
        }
    }

    useEffect(() => {
        barClipTapRef.current.style.clipPath = `polygon(100vw 0px, 0px 0px, 0px ${tapPositionY}px, 100vw ${tapPositionY}px)`
    }, [tapPositionY])

    const tapTile = (accuracy) => {
        const tile = tileRef.current
        if (tile != null) {
            if (accuracy == "miss") {
                unloadTile()
            } else {
                tile.style.animationPlayState = "paused"
                const tileBox = tile.getBoundingClientRect()
                setTapPositionY(tileBox.top + tileBox.height / 2)
                const bar = barRef.current
                bar.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar}`
                scoreIncrementer.current = setInterval(() => {
                    updateScoreAndCombo(accuracy)
                }, (elapseTime - 0.15) / (elapseBeatCount - 1) * 1000)
            }
        }
    }

    const releaseTile = () => {
        unloadTile()
    }

    const unloadTile = () => {
        clearInterval(scoreIncrementer.current)
        const tile = tileRef.current
        if (tile != null) {
            tile.style.animation = "none"
            tile.style.opacity = 0
        }
        const bar = barRef.current
        if (bar != null) {
            bar.style.animation = "none"
            bar.style.opacity = 0
        }
        setIsUnloaded(true)
    }

    const handleMiss = () => {
        onMiss(type, targetTime)
        unloadTile()
    }

    const handleFinish = () => {
        unloadTile()
    }


    return (
        isUnloaded ? "" :
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
                            @keyframes move-y-bar-tapped-${id} {
                                from { 
                                    bottom: ${window.innerHeight - tapPositionY}px; 
                                    opacity: 1;
                                }
                                to { 
                                    bottom: calc(${(window.innerHeight - tapPositionY) - barHeightRef.current}px);
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
        </div> 
    )
    
}

export default HoldTile