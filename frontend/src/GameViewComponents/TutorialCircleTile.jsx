import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import AnimationView from '../utilComponents/AnimationView'
import circleInLeft from "../images/tile-circle-in-left.png"
import circleInRight from "../images/tile-circle-in-right.png"
import circleInLeftLight from "../images/tile-circle-in-left-light.png"
import circleInRightLight from "../images/tile-circle-in-right-light.png"

const TutorialCircleTile = ({ type, tileSpeed, theme, targetTime, onMount, onMiss, reset, id }) => {

    const circleInWrapperRef = useRef(null)
    const circleInRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.2, 0.0, 0.6, 0.4)"
    const timingFunctionOpacity = "cubic-bezier(0.5, 0.0, 0.7, 0.2)"
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

    const handlePress = (e) => {
        if ((e.key == "s" && type == "left-circle") || (e.key == "l" && type == "right-circle")) {
            tapTile(getTileAccuracy())
        } 
    }

    const controller = (instructions, options = null) => {
        const circleIn = circleInRef.current
        const circleInWrapper = circleInWrapperRef.current
        switch (instructions) {
            case "getClass":
                return "circle"
            case "tap":
                tapTile(options)
                break
            case "pauseAnimation":
                if (circleIn && circleIn.style) {
                    circleIn.style.animationPlayState = "paused"
                }
                if (circleInWrapper && circleInWrapper.style) {
                    circleInWrapper.style.animationPlayState = "paused"
                }
                break
            case "playAnimation":
                if (circleIn && circleIn.style) {
                    circleIn.style.animationPlayState = "running"
                }
                if (circleInWrapper && circleInWrapper.style) {
                    circleInWrapper.style.animationPlayState = "running"
                }
                break
            default:
                console.log("error in circle tile")
                break
        }
    }

    const loadTile = () => {
        const circleIn = circleInRef.current
        const circleInWrapper = circleInWrapperRef.current
        if (type != "placeholder") {
            circleInWrapper.style.animation = `increase-size-circle ${(tileSpeed * 0.84) + "s"} ${timingFunctionMove} forwards, 
                                               increase-opacity ${(tileSpeed * 0.84) + "s"} ${timingFunctionOpacity} forwards`
            circleIn.style.animation = `rotate-circle-${type} ${(tileSpeed * 0.84) + "s"} ${timingFunctionMove} forwards`
        }
    }

    const [playAnimation, setPlayAnimation] = useState(false)
    const animationHeight = useRef("0px")
    const animationWidth = useRef("0px")
    const animationX = useRef("0px")
    const animationY = useRef("0px")
    const animationName = useRef(null)
    const tappableRef = useRef(true)
    const tappedRef = useRef(false)

    const tapTile = (accuracy) => {
        if (!tappableRef.current) {
            return
        }
        tappedRef.current = true
        const circleIn = circleInRef.current
        const circleInWrapper = circleInWrapperRef.current
        if (circleIn && circleInWrapper) {
            circleIn.style.animationPlayState = "paused"
            circleInWrapper.style.animationPlayState = "paused"
            circleIn.style.animation = "none"
            if (accuracy == "perfect") {
                animationHeight.current = "calc(26.5vh * 1500 / 850)"
                animationWidth.current = "calc(26.5vh * 1500 / 850)"
                animationY.current = "calc(100vh - (25vh + 26.5vh / 2))"
                switch (type) {
                    case "left-circle":
                        animationX.current = "calc(13vw + 26.5vh / 2)"
                        break
                    case "right-circle":
                        animationX.current = "calc(87vw - 26.5vh / 2)"
                        break
                    default:
                        console.log("error in circle tile 1")
                        break
                }
            } else {
                const rect = circleInWrapper.getBoundingClientRect()
                animationHeight.current = (rect.height * 1500 / 850) + "px"
                animationWidth.current = (rect.height * 1500 / 850) + "px"
                animationX.current = (rect.left + rect.width / 2) + "px"
                animationY.current = (rect.top + rect.height / 2) + "px"
            }
            if (accuracy == "great") {
                animationName.current = "circle-good"
            } else {
                animationName.current = `circle-${accuracy}`
            }
            circleInWrapper.style.animation = "none"
            setPlayAnimation(true)
        }
    }

    const unloadTile = (directMiss=false) => {
        tappableRef.current = false
        const circleIn = circleInRef.current
        if (circleIn) {
            if (directMiss) {
                circleIn.style.animation = `decrease-opacity 0.3s linear forwards`
                setTimeout(() => {
                    reset()
                    setIsUnloaded(true)
                }, 300)
            } else {
                circleIn.style.animation = "none"
                circleIn.style.opacity = 0
                reset()
                setIsUnloaded(true)
            }
        }
    }

    const handleMiss = () => {
        if (!tappedRef.current) {
            onMiss(type, targetTime)
            unloadTile(true)
        }
    }

    return (
        isUnloaded ? "" :
        <div className="screen" style={{zIndex: id}}>
            {playAnimation ?
                <div style={{zIndex: 1000}}>
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
            <div className="circle-tile-wrapper" style={{right: type == "right-circle" ? "13vw" : "auto", left: type == "left-circle" ? "13vw" : "auto"}}>
                <div className="circle-tile-in" ref={circleInRef} style={{transform: "rotate(180deg)"}} onAnimationEnd={() => {
                    setTimeout(() => {     
                        handleMiss()
                    }, (tileSpeed * 0.16) * 1000)
                }}>
                    <div className="circle-tile-in-wrapper" ref={circleInWrapperRef}>
                        {
                            type == "left-circle" ?
                            <img src={theme == "light" ? `/image?fileName=${"tile-circle-in-left-light"}` : `/image?fileName=${"tile-circle-in-left"}`} alt="circle"/> :
                            <img src={theme == "light" ? `/image?fileName=${"tile-circle-in-right-light"}` : `/image?fileName=${"tile-circle-in-right"}`} alt="circle"/>
                        }
                    </div>
                </div>
            </div>
        </div> 
    )
    
}

export default TutorialCircleTile