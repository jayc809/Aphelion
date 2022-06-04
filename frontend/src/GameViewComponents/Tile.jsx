import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import AnimationView from '../AnimationView'
import tileImage from "../images/tile.png"

const Tile = ({ type, tileSpeed, targetTime, onMount, onMiss, id }) => {

    const tileRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const timingFunctionOpacity = "cubic-bezier(0.0, 0.7, 0.0, 0.9)"
    const [isUnloaded, setIsUnloaded] = useState(false)

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
                return "tap"
            case "tap":
                tapTile()
                break
            case "pauseAnimation":
                tileRef.current.style.animationPlayState = "paused"
                break
            case "playAnimation":
                tileRef.current.style.animationPlayState = "running"
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
    const tapTile = () => {
        const tile = tileRef.current
        tile.style.animationPlayState = "paused"
        const rect = tileRef.current.getBoundingClientRect()
        animationHeight.current = (rect.height * 450 / 120) + "px"
        animationWidth.current = (rect.width * 700 / 500) + "px"
        animationX.current = (rect.left + rect.width / 2) + "px"
        animationY.current = (rect.top + rect.height / 2) + "px"
        tile.style.animation = "none"
        tile.style.opacity = 0
        setPlayAnimation(true)
    }

    const unloadTile = () => {
        const tile = tileRef.current
        tile.style.animation = "none"
        tile.style.opacity = 0
        setIsUnloaded(true)
    }

    const handleMiss = () => {
        onMiss(type, targetTime)
        unloadTile()
    }

    return (
        isUnloaded ? "" :
        <div className="tile-wrapper" style={{zIndex: id}}>
            {playAnimation ?
                <AnimationView 
                    height={animationHeight.current} 
                    width={animationWidth.current} 
                    x={animationX.current} 
                    y={animationY.current} 
                    dirName={"tap-good"} 
                    start={0} end={29} elapseTime={0.65} 
                    onComplete={unloadTile}
                ></AnimationView> :
                ""
            }
            <div className="tile" ref={tileRef} onAnimationEnd={handleMiss}>
                <img 
                    src={tileImage} 
                    alt="tile"
                />
            </div>
        </div> 
    )
    
}

export default Tile