import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import AnimationView from '../utilComponents/AnimationView'
import circleIn from "../images/tile-circle-in.png"

const CircleTile = ({ type, tileSpeed, theme, targetTime, onMount, onMiss, id }) => {

    const circleInWrapperRef = useRef(null)
    const circleInRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.2, 0.0, 0.6, 0.4)"
    const timingFunctionOpacity = "cubic-bezier(0.5, 0.0, 0.7, 0.2)"
    const [isUnloaded, setIsUnloaded] = useState(false)

    //initializations
    useEffect(() => {
        if (type != "placeholder") {
            // onMount(type, targetTime, controller)
        }
        loadTile()
        // window.addEventListener("keypress", () => {tapTile("perfect")})
    }, [])

    const controller = (instructions, options = null) => {
        const circleIn = circleInRef.current
        switch (instructions) {
            case "getClass":
                return "tap"
            case "tap":
                tapTile(options)
                break
            case "pauseAnimation":
                if (circleIn && circleIn.style) {
                    circleIn.style.animationPlayState = "paused"
                }
                break
            case "playAnimation":
                if (circleIn && circleIn.style) {
                    circleIn.style.animationPlayState = "running"
                }
                break
        }
    }

    const loadTile = () => {
        const circleIn = circleInRef.current
        const circleInWrapper = circleInWrapperRef.current
        if (type != "placeholder") {
            circleInWrapper.style.animation = `increase-size-circle ${(tileSpeed * 0.84) + "s"} ${timingFunctionMove} forwards, 
                                               increase-opacity ${(tileSpeed * 0.84) + "s"} ${timingFunctionOpacity} forwards`
            circleIn.style.animation = `rotate-circle ${(tileSpeed * 0.84) + "s"} ${timingFunctionMove} forwards`
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
        const circleIn = circleInRef.current
        if (circleIn) {
            circleIn.style.animationPlayState = "paused"
            if (accuracy == "perfect") {
                animationHeight.current = "100%"
                animationWidth.current = "100%"
                animationY.current = "22vh"
                switch (type) {
                    case "left":
                        animationX.current = "calc(8vw + 11vh)"
                        break
                    case "right":
                        animationX.current = "calc(92vw - 11vh)"
                        break
                }
            } else {
                const rect = circleIn.getBoundingClientRect()
                animationHeight.current = (rect.height) + "px"
                animationWidth.current = (rect.width) + "px"
                animationX.current = (rect.left + rect.width / 2) + "px"
                animationY.current = (rect.top + rect.height / 2) + "px"
            }
            if (accuracy == "great") {
                animationName.current = "circle-good"
            } else {
                animationName.current = `circle-${accuracy}`
            }
            circleIn.style.animation = "none"
            circleIn.style.opacity = 0
            setPlayAnimation(true)
        }
    }

    const unloadTile = () => {
        tappableRef.current = false
        const circleIn = circleInRef.current
        if (circleIn) {
            circleIn.style.animation = "none"
            circleIn.style.opacity = 0
        }
        setIsUnloaded(true)
    }

    const handleMiss = () => {
        onMiss(type, targetTime)
        unloadTile()
    }

    return (
        isUnloaded ? "" :
        <div className="screen" style={{zIndex: id}}>
            {/* {playAnimation ?
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
            } */}
            <div className="circle-tile-wrapper" style={{right: type == "right" ? "9vw" : "auto", left: type == "left" ? "9vw" : "auto"}}>
                {/* <img className="circle-tile-out" src={circleOut}></img> */}
                <div className="circle-tile-in" ref={circleInRef} onAnimationEnd={() => {
                    setTimeout(() => {
                        circleInRef.current.style.animation = `decrease-opacity 0.3s linear forwards`
                        console.log(circleInRef.current.style.animation)
                        setTimeout(() => {
                            // handleMiss()
                        }, 300);
                    }, (tileSpeed * 0.16) * 1000)
                }}
                >
                    <div className="circle-tile-in-wrapper" ref={circleInWrapperRef}>
                        <img src={theme == "light" ? circleIn : circleIn} alt="circle" />
                    </div>
                </div>
            </div>
        </div> 
    )
    
}

export default CircleTile