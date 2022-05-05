import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const Tile = ({ type, updateScore, tileSpeed, targetBeatNumber, onMount, onMiss}) => {

    const tileRef = useRef(null)
    const timingFunction = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const [state, setState] = useState(1)

    //initializations
    useEffect(() => {
        if (type != "placeholder") {
            onMount(type, targetBeatNumber, setState)
        }
    }, [])

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
            tile.style.animation = `move-${type} ${tileSpeed + "s"} ${timingFunction}`
        }
    }

    const tapTile = () => {
        setState(3)
    }

    const unloadTile = () => {
        const tile = tileRef.current
        tile.style.animation = "none"
        tile.style.opacity = 0
    }

    const handleMiss = () => {
        onMiss(type, targetBeatNumber)
        setState(3)
    }

    return (
        <div className="tile-wrapper">
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