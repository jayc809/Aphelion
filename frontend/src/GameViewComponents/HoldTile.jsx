import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import AnimationView from '../utilComponents/AnimationView'
import tileImage from "../images/tile-hold.png"
import tileImageLight from "../images/tile-hold-light.png"

const HoldTile = ({ type, tileSpeed, theme, targetTime, elapseBeatCount, elapseTime, onMount, onMiss, updateScoreAndCombo, id }) => {

    const tileRef = useRef(null)
    const barRef = useRef(null)
    const barClipRef = useRef(null)
    const barOutline1Ref = useRef(null)
    const barOutline2Ref = useRef(null)
    const barOutlineClip1Ref = useRef(null)
    const barOutlineClip2Ref = useRef(null)
    const barLowerClipRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const timingFunctionMoveBar = "cubic-bezier(1.0, 0.9, 1.0, 0.9)"
    const timingFunctionOpacity = "cubic-bezier(0.0, 0.7, 0.0, 0.9)"
    const [isUnloaded, setIsUnloaded] = useState(false)
    const [tapPositionY, setTapPositionY] = useState(null)
    const scoreIncrementer = useRef(null)
    const barHeightRef = useRef(null)

    //initializations
    // const tapped = useRef(false)
    useEffect(() => {
        if (type != "placeholder") {
            onMount(type, targetTime, controller)
        }
        loadTile()
        // window.addEventListener("keydown", () => {
        //     if (!tapped.current) {
        //         tapTile("good")
        //         tapped.current = true
        //     }
        // })
        // window.addEventListener("keyup", () => {
        //     handleFinish()
        // })
    }, [])

    const controller = (instructions, options = null) => {
        const tile = tileRef.current
        const bar = barRef.current
        const barOutline1 = barOutline1Ref.current
        const barOutline2 = barOutline2Ref.current
        switch (instructions) {
            case "getClass":
                return "hold"
            case "hold":
                tapTile(options)
                break
            case "release":
                handleFinish()
                break
            case "pauseAnimation":
                if (tile && tile.style) {
                    tile.style.animationPlayState = "paused"
                }
                if (bar && bar.style) {
                    bar.style.animationPlayState = "paused"
                }
                if (barOutline1 && barOutline2) {
                    barOutline1.style.animationPlayState = "paused"
                    barOutline2.style.animationPlayState = "paused"
                }
                break
            case "playAnimation":
                if (tile && tile.style) {
                    tile.style.animationPlayState = "running"
                }
                if (bar && bar.style) {
                    bar.style.animationPlayState = "running"
                }
                if (barOutline1 && barOutline2) {
                    barOutline1.style.animationPlayState = "running"
                    barOutline2.style.animationPlayState = "running"
                }
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
        const barOutline1 = barOutline1Ref.current
        const barOutline2 = barOutline2Ref.current
        barOutline1.style.height = String(barHeightRef.current) + "px"
        barOutline2.style.height = String(barHeightRef.current) + "px"

        const tile = tileRef.current
        const barClip = barClipRef.current
        const barOutlineClip1 = barOutlineClip1Ref.current
        const barOutlineClip2 = barOutlineClip2Ref.current
        if (type == "placeholder") {
            tile.style.opacity = 0
        } else {
            switch (type) {
                case "left":
                    barClip.style.clipPath = "polygon(47.3vw 40vh, 47.1vw 40vh, 22.6vw 100vh, 26.6vw 100vh)"
                    barOutlineClip1.style.clipPath = "polygon(47.1vw 40vh, 22.3vw 100vh, 22.8vw 100vh)"
                    barOutlineClip2.style.clipPath = "polygon(47.3vw 40vh, 26.6vw 100vh, 26.1vw 100vh)"
                    break
                case "middle-left":
                    barClip.style.clipPath = "polygon(49.2vw 40vh, 48.8vw 40vh, 39vw 100vh, 44vw 100vh)"
                    break
                case "middle-right":
                    barClip.style.clipPath = "polygon(51.3vw 40vh, 50.9vw 40vh, 56.1vw 100vh, 61.1vw 100vh)"
                    break
                case "right":
                    barClip.style.clipPath = "polygon(53.2vw 40vh, 53vw 40vh, 73.6vw 100vh, 77.6vw 100vh)"
                    barOutlineClip1.style.clipPath = "polygon(53vw 40vh, 73.3vw 100vh, 73.8vw 100vh)"
                    barOutlineClip2.style.clipPath = "polygon(53.2vw 40vh, 77.6vw 100vh, 77.1vw 100vh)"
                    break
            }
            
            tile.style.animation = `move-x-${type} ${tileSpeed + "s"} ${timingFunctionMove}, 
                                    move-y ${tileSpeed + "s"} ${timingFunctionMove},
                                    increase-size-tile ${tileSpeed + "s"} ${timingFunctionMove},
                                    increase-opacity ${tileSpeed + "s"} ${timingFunctionOpacity}`
            bar.style.animation = `move-y-bar ${tileSpeed + "s"} ${timingFunctionMove}, 
                                   increase-opacity-bar ${tileSpeed + "s"} ${timingFunctionOpacity}`
            barOutline1.style.animation = `move-y-bar ${tileSpeed + "s"} ${timingFunctionMove}`
            barOutline1.style.opacity = 1
            barOutline2.style.animation = `move-y-bar ${tileSpeed + "s"} ${timingFunctionMove}`
            barOutline2.style.opacity = 1
        }
    }

    useEffect(() => {
     barLowerClipRef.current.style.clipPath = `polygon(100vw 0px, 0px 0px, 0px ${tapPositionY}px, 100vw ${tapPositionY}px)`
    }, [tapPositionY])

    const [playHoldAnimation, setPlayHoldAnimation] = useState(false)
    const [playEndAnimation, setPlayEndAnimation] = useState(false)
    const animationHeight = useRef("0px")
    const animationWidth = useRef("0px")
    const animationX = useRef("0px")
    const animationY = useRef("0px")
    const animationName = useRef(null)
    const endWasAMissRef = useRef(false)
    const tappableRef = useRef(true)

    const tapTile = (accuracy) => {
        const tile = tileRef.current
        if (!tappableRef.current) {
            return
        }
        if (tile) {
            tile.style.animationPlayState = "paused"
            if (accuracy == "miss") {
                const rect = tile.getBoundingClientRect()
                animationHeight.current = (rect.height * 450 / 120 * 0.93) + "px"
                animationWidth.current = (rect.width * 700 / 500 * 0.93) + "px"
                animationX.current = (rect.left + rect.width / 2) + "px"
                animationY.current = (rect.top + rect.height / 2) + "px"

                endWasAMissRef.current = true
                setTapPositionY(rect.top + rect.height / 2)
                setPlayEndAnimation(true)
                handleTapMiss()
            } else if (accuracy == "perfect") {
                animationName.current = "hold-perfect"
                animationHeight.current = (window.innerHeight * 35.7 / 646 * 450 / 120 * 0.93) + "px"
                animationWidth.current = (window.innerWidth * 130 / 1146 * 700 / 500 * 0.93) + "px"
                animationY.current = "calc(100vh * 680 / 800)"
                switch (type) {
                    case "left":
                        animationX.current = "calc(100vw * 386 / 1280)"
                        break
                    case "middle-left":
                        animationX.current = "calc(100vw * 557 / 1280)"
                        break
                    case "middle-right":
                        animationX.current = "calc(100vw * 725 / 1280)"
                        break
                    case "right":
                        animationX.current = "calc(100vw * 896 / 1280)"
                        break
                }

                setTapPositionY(window.innerHeight * 679 / 800)
                setPlayHoldAnimation(true)
                const bar = barRef.current
                const barOutline1 = barOutline1Ref.current
                const barOutline2 = barOutline2Ref.current
                bar.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`
                barOutline1.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`
                barOutline2.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`

                scoreIncrementer.current = setInterval(() => {
                    updateScoreAndCombo(accuracy)
                }, (elapseTime - 0.15) / (elapseBeatCount - 1) * 1000)
            } else {
                animationName.current = "hold-good"
                const rect = tile.getBoundingClientRect()
                animationHeight.current = (rect.height * 450 / 120 * 0.93) + "px"
                animationWidth.current = (rect.width * 700 / 500 * 0.93) + "px"
                animationX.current = (rect.left + rect.width / 2) + "px"
                animationY.current = (rect.top + rect.height / 2) + "px"

                setTapPositionY(rect.top + rect.height / 2)
                setPlayHoldAnimation(true)
                const bar = barRef.current
                const barOutline1 = barOutline1Ref.current
                const barOutline2 = barOutline2Ref.current
                bar.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`
                barOutline1.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`
                barOutline2.style.animation = `move-y-bar-tapped-${id} ${elapseTime + "s"} ${timingFunctionMoveBar} forwards`

                scoreIncrementer.current = setInterval(() => {
                    updateScoreAndCombo(accuracy)
                }, (elapseTime - 0.15) / (elapseBeatCount - 1) * 1000)
            }
            tile.style.animation = "none"
            tile.style.opacity = 0
        }
    }

    const isUnloadedRef = useRef(false)
    const unloadTile = (directMiss) => {
        if (directMiss) {
            tappableRef.current = false
        }
        isUnloadedRef.current = true
        clearInterval(scoreIncrementer.current)
        const tile = tileRef.current
        if (tile) {
            if (directMiss) {
                tile.style.opacity = 0
            }
        }
        const bar = barRef.current
        if (bar) {
            bar.style.animationPlayState = "paused"
            const rect = bar.getBoundingClientRect()
            bar.style.left = rect.left + "px"
            bar.style.top = rect.top + "px"
            if (directMiss) {
                bar.style.animation = "opacity-06-0 0.3s linear forwards"
            } else {
                bar.style.animation = "opacity-1-0 0.3s linear forwards"
            }
        }
        const barOutline1 = barOutline1Ref.current
        const barOutline2 = barOutline2Ref.current
        if (barOutline1 && barOutline2) {
            barOutline1.style.animationPlayState = "paused"
            barOutline2.style.animationPlayState = "paused"
            const rect = barOutline1.getBoundingClientRect()
            barOutline1.style.left = rect.left + "px"
            barOutline2.style.left = rect.left + "px"
            barOutline1.style.top = rect.top + "px"
            barOutline2.style.top = rect.top + "px"
            if (directMiss) {
                barOutline1.style.animation = "opacity-06-0 0.3s linear forwards"
                barOutline2.style.animation = "opacity-06-0 0.3s linear forwards"
            } else {
                barOutline1.style.animation = "opacity-06-0 0.3s linear forwards"                
                barOutline2.style.animation = "opacity-06-0 0.3s linear forwards"

            }
        }
    }

    const trueUnload = () => {
        setIsUnloaded(true)
    }

    const handleMiss = () => {
        onMiss(type, targetTime)
        unloadTile(true)
    }

    const handleTapMiss = () => {
        if (!isUnloadedRef.current) {
            unloadTile(false)
        }
    }

    const handleFinish = () => {
        if (!isUnloadedRef.current) {
            unloadTile(false)
        }
        setPlayHoldAnimation(false)
        setPlayEndAnimation(true)
    }

    return (
        isUnloaded ? "" :
        <div className="tile-wrapper" style={{zIndex: id}}>
            <div style={{height: "100vh", width: "100vw", position: "absolute", zIndex: 1000}}>
                {playHoldAnimation ?
                    <div style={{filter: "saturate(1.35) brightness(1.05)"}}>
                        <AnimationView 
                            height={animationHeight.current} 
                            width={animationWidth.current} 
                            x={animationX.current} 
                            y={animationY.current} 
                            dirName={animationName.current} 
                            start={0} end={59} loop={true} loopStart={31}
                        ></AnimationView> 
                    </div> :
                    ""
                }
                {playEndAnimation ? 
                    (<div style={{filter: `hue-rotate(0deg) saturate(${endWasAMissRef.current ? 0 : 1.35}) brightness(1.05)`}}>
                        <AnimationView 
                            height={animationHeight.current} 
                            width={animationWidth.current} 
                            x={animationX.current} 
                            y={animationY.current} 
                            dirName={"hold-end"} 
                            start={0} end={29} loop={false}
                            onComplete={trueUnload}
                        ></AnimationView> 
                    </div>) :
                    ""
                }
            </div>
            <div className="tile" ref={tileRef} onAnimationEnd={handleMiss}>
                <img 
                    src={theme == "light" ? tileImageLight : tileImage} 
                    alt="tile"
                />
            </div>
            
            <div className="bar-wrapper" ref={barLowerClipRef}>
                <div className="bar-outline-clip-1" ref={barOutlineClip1Ref}>
                    <div className="bar-outline" ref={barOutline1Ref}></div>
                </div>
                <div className="bar-outline-clip-2" ref={barOutlineClip2Ref}>
                    <div className="bar-outline" ref={barOutline2Ref}></div>
                </div>
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
                    </div>
                </div>
            </div>
        </div> 
    )
    
}

export default HoldTile