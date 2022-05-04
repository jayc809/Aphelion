import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const Tile = ({ type, updateScore, state}) => {

    const tileRef = useRef(null)

    const tileSpeed = 1
    const timingFunction = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"

    const currFrameRef = useRef(0)
    const positionIntervalRef = useRef(null)
    const rerenderRate = 50
    const totalFrames = tileSpeed / (50 / 1000)

    const accuracy = {perfect: 1, great: 2, good: 3}

    //initializations

    // handle lifecycle state changes
    useEffect(() => {
        switch (state) {
            case 1: 
                //tile is moving
                loadTile(type)
                break
            case 2:
                //tile has been tapped
                tapTile(type)
                break
            case 3: 
                //tile is inactive
                unloadTile()
                break
        }
    }, [state])

    const loadTile = (type) => {
        const tile = tileRef.current
        tile.style.animation = `move-${type} ${tileSpeed + "s"} ${timingFunction}`
    }

    const tapTile = (type) => {
        const tile = tileRef.current
        tile.style.animation = "none"
        tile.style.opacity = 0
    }

    const unloadTile = () => {
        const tile = tileRef.current
        tile.style.animation = "none"
        tile.style.opacity = 0
    }

    return (
        <div className="tile-wrapper">
            <div className="tile" ref={tileRef}>
                <img 
                    src={tileImage} 
                    alt="tile"
                />
            </div>
        </div>
    )
    
}

export default Tile