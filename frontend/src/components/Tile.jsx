import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const Tile = ({ type, updateScore, state}) => {

    const tileRef = useRef(null)

    const tileSpeed = 1
    const timingFunction = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"

    const [stateLocal, setStateLocal] = useState(state)

    const accuracy = {perfect: 1, great: 2, good: 3}

    //initializations

    // handle lifecycle state changes
    useEffect(() => {
        setStateLocal(state)
        switch (stateLocal) {
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
        if (type == "placeholder") {
            tile.style.opacity = 0
        } else {
            tile.style.animation = `move-${type} ${tileSpeed + "s"} ${timingFunction}`
        }
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
            <div className="tile" ref={tileRef} onAnimationEnd={() => {setStateLocal(3)}}>
                <img 
                    src={tileImage} 
                    alt="tile"
                />
            </div>
        </div>
    )
    
}

export default Tile