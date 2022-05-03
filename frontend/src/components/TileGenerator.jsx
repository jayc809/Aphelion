import React, { useEffect, useState } from 'react'
import Tile from "./Tile"
import "../styles/TileGenerator.css"

const TileGenerator = ({ beatmap, onMount, updateScore }) => {

    const [beatmapIndex, setBeatmapIndex] = useState(0)

    useEffect(() => {
        onMount(beatmapIndex, setBeatmapIndex)
    }, [])

    return (
        <div className="tile-generator-wrapper">
            <h1 style={{color: "white"}}>{beatmapIndex}</h1>
            {/* <Tile type={"left"} updateScore={updateScore} move={true}/> */}
        </div>
    )
}

export default TileGenerator