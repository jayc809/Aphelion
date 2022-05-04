import React, { useEffect, useState } from 'react'
import Tile from "./Tile"
import "../styles/TileGenerator.css"

const TileGenerator = ({ beatmap, onMount, updateScore }) => {

    const [beatmapIndex, setBeatmapIndex] = useState(0)
    const [tileState, setTileState] = useState(3)
    
    useEffect(() => {
        onMount(beatmapIndex, setBeatmapIndex)
        window.addEventListener("keypress", handlePress)
        return () => {
            window.removeEventListener("keypress", handlePress)
        }
    }, [])

    useEffect(() => {
        if (beatmapIndex % 10 == 0) {
            setTileState(3)
        } else if (tileState != 2) {
            setTileState(1)
        }
    }, [beatmapIndex])

    const handlePress = (e) => {
        setTileState(2)
    }

    return (
        <div className="tile-generator-wrapper">
            {/* <h1 className="beat-counter" style={{color: "white"}}>{beatmapIndex}</h1> */}
            <Tile type={"left"} updateScore={updateScore} state={tileState}/>
        </div>
    )
}

export default TileGenerator