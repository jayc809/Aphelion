import React, { useEffect, useRef, useState } from 'react'
import Tile from "./Tile"
import "../styles/TileGenerator.css"

const TileGenerator = ({ beatmapObj, onMount }) => {

    const [beatNumber, setBeatNumber] = useState(0)
    const [currentTiles, setCurrentTiles] = useState(
        Array.apply(null, Array(30)).map((nul, index) => {
            return {beatNumber: -1, type: "placeholder", state: 1, id: index - 30}
        })
    )
    // [
    //     {beatNumber: 0, type: "left", state: 1},
    //     {beatNumber: 0, type: "middle-left", state: 1},
    //     {beatNumber: 0, type: "middle-right", state: 1},
    //     {beatNumber: 0, type: "right", state: 1}
    // ])
    const beatmapIndexRef = useRef(0)

    console.log("rerendered tilegen")


    useEffect(() => {
        onMount(beatNumber, setBeatNumber)
        window.addEventListener("keypress", handlePress)
        // window.addEventListener("mouseup", handleClick)
        return () => {
            window.removeEventListener("keypress", handlePress)
            // window.removeEventListener("mouseup", handleClick)
        }
    }, [])

    useEffect(() => {
        // console.log("beat: " + beatNumber)
        while (true) {
            if (beatmapIndexRef.current < beatmapObj.beatmap.length) {
                const tile = beatmapObj.beatmap[beatmapIndexRef.current]
                if (tile.beatNumber == beatNumber) {
                    setCurrentTiles(currentTiles.slice(1, currentTiles.length).concat(tile))
                    beatmapIndexRef.current += 1
                } else {
                    break
                }
            } else {
                break
            }    
        }
    }, [beatNumber])

    const handlePress = (e) => {
        console.log("pressed")
        // setTileState(2)
    }

    // const handleClick = () => {
    //     setCurrentTiles(() => {
    //         const newArray = currentTiles.slice(1, currentTiles.length).concat({beatNumber: 99, type: "right", state: 1})
    //         // console.log(newArray)
    //         return newArray
    //     })
    // }

    return (
        <div className="tile-generator-wrapper">
            {/* <h1 className="beat-counter" style={{color: "white"}}>{beatmapIndex}</h1> */}
            {
                currentTiles.map((tile, index) => <Tile type={tile.type} state={tile.state} key={tile.id}></Tile>)
            }
        </div>
    )
}

export default TileGenerator