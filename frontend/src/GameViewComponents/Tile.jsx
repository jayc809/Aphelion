import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const Tile = ({ type, tileSpeed, targetBeatNumber, onMount, onMiss, id }) => {

    const tileRef = useRef(null)
    const timingFunctionMove = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const timingFunctionOpacity = "cubic-bezier(0.0, 0.7, 0.0, 0.9)"
    const [state, setState] = useState(1)

    //initializations
    useEffect(() => {
        if (type != "placeholder") {
            onMount(type, targetBeatNumber, controller)
        }
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

    const tapTile = () => {
        setState(3)
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

    return (
        state != 4 ? 
        <div className="tile-wrapper" style={{zIndex: id}}>
            <div className="tile" ref={tileRef} onAnimationEnd={handleMiss}>
                <img 
                    src={tileImage} 
                    alt="tile"
                />
            </div>
        </div> :
        ""
    )
    
}

export default Tile