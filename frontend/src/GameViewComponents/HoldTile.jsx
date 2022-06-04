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
    const tapped = useRef(false)
    useEffect(() => {
        if (type != "placeholder") {
            onMount(type, targetTime, controller)
        }
        loadTile()
        window.addEventListener("keydown", () => {
            if (!tapped.current) {
                tapTile("perfect")
                tapped.current = true
            }
        })
        window.addEventListener("keyup", () => {
            releaseTile()
        })
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
                tile.style.animationPlayState = "paused"
                const rect = tile.getBoundingClientRect()
                tile.style.animation = "none"
                tile.style.opacity = 1
                tile.style.height = rect.height + "px"
                tile.style.width = rect.width + "px"
                tile.style.left = rect.left + "px"
                tile.style.top = rect.top + "px"
                unloadTile()
            } else if (accuracy == "perfect") {
                tile.style.animationPlayState = "paused"
                tile.style.animation = "none"
                tile.style.opacity = 1
                const windowHeight = window.innerHeight
                const windowWidth = window.innerWidth
                setTapPositionY(windowHeight * 679 / 800)
                const tileHeight = windowHeight * 35.7 / 646
                const tileWidth = windowWidth * 130 / 1146
                tile.style.height = tileHeight + "px"
                tile.style.width = tileWidth + "px"
                tile.style.top = (windowHeight * 679 / 800 - tileHeight / 2) + "px"
                switch (type) {
                    case "left":
                        tile.style.left = (windowWidth * 386 / 1280 - tileWidth / 2) + "px"
                        // animationX.current = "calc(100vw * 386 / 1280)"
                        break
                    case "middle-left":
                        tile.style.left = (windowWidth * 557 / 1280 - tileWidth / 2) + "px"
                        // animationX.current = "calc(100vw * 557 / 1280)"
                        break
                    case "middle-right":
                        tile.style.left = (windowWidth * 725 / 1280 - tileWidth / 2) + "px"
                        // animationX.current = "calc(100vw * 725 / 1280)"
                        break
                    case "right":
                        tile.style.left = (windowWidth * 896 / 1280 - tileWidth / 2) + "px"
                        // animationX.current = "calc(100vw * 896 / 1280)"
                        break
                }
                const bar = barRef.current
                bar.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`
                scoreIncrementer.current = setInterval(() => {
                    updateScoreAndCombo(accuracy)
                }, (elapseTime - 0.15) / (elapseBeatCount - 1) * 1000)
            } else  {
                tile.style.animationPlayState = "paused"
                const rect = tile.getBoundingClientRect()
                tile.style.animation = "none"
                tile.style.opacity = 1
                tile.style.height = rect.height + "px"
                tile.style.width = rect.width + "px"
                tile.style.left = rect.left + "px"
                tile.style.top = rect.top + "px"
                setTapPositionY(rect.top + rect.height / 2)
                const bar = barRef.current
                bar.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`
                scoreIncrementer.current = setInterval(() => {
                    updateScoreAndCombo(accuracy)
                }, (elapseTime - 0.15) / (elapseBeatCount - 1) * 1000)
            }
        }
    }

    const unloadTile = () => {
        clearInterval(scoreIncrementer.current)
        const tile = tileRef.current
        if (tile != null) {
            tile.style.animation = "opacity-1-0 0.3s linear forwards"
        }
        const bar = barRef.current
        if (bar != null) {
            console.log("yee")
            bar.style.animationPlayState = "paused"
            const rect = bar.getBoundingClientRect()
            bar.style.left = rect.left + "px"
            bar.style.top = rect.top + "px"
            bar.style.animation = "opacity-1-0 0.3s linear forwards"
        }
        // setIsUnloaded(true)
    }

    const releaseTile = () => {
        unloadTile()
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
                                    bottom: calc(${(window.innerHeight - tapPositionY) - barHeightRef.current * 1.075}px);
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