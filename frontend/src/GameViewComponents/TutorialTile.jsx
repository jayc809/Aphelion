import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import AnimationView from '../utilComponents/AnimationView'
import tileImage from "../images/tile.png"
import tileImageLight from "../images/tile-light.png"

const TutorialTile = ({ type, tileSpeed, theme, targetTime, onMount, onMiss, reset, id }) => {

    const tileRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const timingFunctionOpacity = "cubic-bezier(0.0, 0.7, 0.0, 0.9)"
    const [isUnloaded, setIsUnloaded] = useState(false)
    const currTimeRef = useRef(0)

    //initializations
    useEffect(() => {
        if (type != "placeholder") {
            onMount(type, targetTime, controller)
        }
        loadTile()
        const timer = setInterval(() => {
            currTimeRef.current += 0.01
        }, 10)
        window.addEventListener("keypress", handlePress)
        return() => {
            clearInterval(timer)
            window.removeEventListener("keypress", handlePress)
        }
    }, [])

    const handlePress = (e) => {
        if ((e.key == "f" && type == "middle-left") || (e.key == "j" && type == "middle-right")) {
            tapTile(getTileAccuracy())
        } 
    }

    const getTileAccuracy = () => {
        const targetCrossTime = (tileSpeed * 0.84)
        const accuracyUnit = tileSpeed / 14
        const timeDifference = Math.abs(currTimeRef.current - targetCrossTime)
        if (timeDifference <= accuracyUnit) {
            return "perfect"
        } else if (timeDifference <= 1 * accuracyUnit) {
            return "great"
        } else if (timeDifference <= 3 * accuracyUnit) {
            return "good"
        } else {
            return "miss"
        }
    }

    const controller = (instructions, options = null) => {
        const tile = tileRef.current
        switch (instructions) {
            case "getClass":
                return "tap"
            case "tap":
                tapTile(options)
                break
            case "pauseAnimation":
                if (tile && tile.style) {
                    tile.style.animationPlayState = "paused"
                }
                break
            case "playAnimation":
                if (tile && tile.style) {
                    tile.style.animationPlayState = "running"
                }
                break
            default:
                console.log("error in tile")
                break
        }
    }

    const loadTile = () => {
        const tile = tileRef.current
        if (type == "placeholder") {
            tile.style.opacity = 0
        } else {
            tile.style.animation = `move-x-${type} ${tileSpeed + "s"} ${timingFunctionMove}, 
                                    move-y ${tileSpeed + "s"} ${timingFunctionMove},
                                    increase-size-tile ${tileSpeed + "s"} ${timingFunctionMove},
                                    increase-opacity ${tileSpeed + "s"} ${timingFunctionOpacity}`
        }
    }

    const [playAnimation, setPlayAnimation] = useState(false)
    const animationHeight = useRef("0px")
    const animationWidth = useRef("0px")
    const animationX = useRef("0px")
    const animationY = useRef("0px")
    const animationName = useRef(null)
    const tappableRef = useRef(true)

    const tapTile = (accuracy) => {
        if (!tappableRef.current) {
            return
        }
        const tile = tileRef.current
        if (tile) {
            tile.style.animationPlayState = "paused"
            if (accuracy == "perfect") {
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
                    default:
                        console.log("error in tile 1")
                        break
                }
            } else {
                const rect = tile.getBoundingClientRect()
                animationHeight.current = (rect.height * 450 / 120 * 0.93) + "px"
                animationWidth.current = (rect.width * 700 / 500 * 0.93) + "px"
                animationX.current = (rect.left + rect.width / 2) + "px"
                animationY.current = (rect.top + rect.height / 2) + "px"
            }
            if (accuracy == "great") {
                animationName.current = "tap-good"
            } else {
                animationName.current = `tap-${accuracy}`
            }
            tile.style.animation = "none"
            tile.style.opacity = 0
            setPlayAnimation(true)
        }
    }

    const unloadTile = () => {
        tappableRef.current = false
        const tile = tileRef.current
        if (tile) {
            tile.style.animation = "none"
            tile.style.opacity = 0
        }
        setIsUnloaded(true)
        reset()
    }

    const handleMiss = () => {
        onMiss(type, targetTime)
        unloadTile()
    }

    return (
        isUnloaded ? "" :
        <div className="tile-wrapper" style={{zIndex: id}}>
            {playAnimation ?
                <div style={{filter: "saturate(1.35) brightness(1.05)", zIndex: 1000}}>
                    <AnimationView 
                        height={animationHeight.current} 
                        width={animationWidth.current} 
                        x={animationX.current} 
                        y={animationY.current} 
                        dirName={animationName.current} 
                        start={0} end={29} loop={false}
                        onComplete={unloadTile}
                    ></AnimationView> 
                </div> :
                ""
            }
            <div className="tile" ref={tileRef} onAnimationEnd={handleMiss}>
                <img 
                    src={theme == "light" ? `/image?fileName=${"tile-light"}` : `/image?fileName=${"tile"}`} 
                    alt="tile"
                />
            </div>
        </div> 
    )
    
}

export default TutorialTile