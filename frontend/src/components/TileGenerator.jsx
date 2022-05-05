import React, { useEffect, useRef, useState } from 'react'
import Tile from "./Tile"
import "../styles/TileGenerator.css"

const TileGenerator = ({ beatmapObj, onMount, tileSpeed }) => {

    const [beatNumber, setBeatNumber] = useState(0)
    const [currentTiles, setCurrentTiles] = useState(
        Array.apply(null, Array(30)).map((nul, index) => {
            return {beatNumber: -1, type: "placeholder", state: 1, id: index - 30}
        })
    )
    const currentTilesRef = useRef(currentTiles)
    const beatmapIndexRef = useRef(0)

    useEffect(() => {
        onMount(beatNumber, setBeatNumber)
        window.addEventListener("keypress", handlePress)
        return () => {
            window.removeEventListener("keypress", handlePress)
        }
    }, [])

    useEffect(() => {
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

    useEffect(() => {
        currentTilesRef.current = currentTiles
    }, [currentTiles])




    const handlePress = (e) => {
        switch (e.key) {
            case "d":
                startTapAnimation("left")
                break
            case "f":
                startTapAnimation("middle-left")
                break
            case "j":
                startTapAnimation("middle-right")
                break
            case "k":
                startTapAnimation("right")
                break
        }
    }
    //sets up a dictionary of setStates for each tile mounted
    const tileSetStates = useRef({})
    const onTileMount = (type, targetBeatNumber, setState) => {
        const key = String(targetBeatNumber) + type
        tileSetStates.current[key] = setState
    }
    //sets up list of missed tiles
    const missedTiles = useRef([])
    const onTileMiss = (type, targetBeatNumber) => {
        const key = String(targetBeatNumber) + type
        missedTiles.current.push(key)
    }
    //finds the closest tile of type and starts animation using setState
    const tappedTiles = useRef([])
    const startTapAnimation = (type) => {
        let closestTileBeatNumber = null
        //makes a copy of currentTiles
        const tiles = JSON.parse(JSON.stringify(currentTilesRef.current))
        for (let i = 0; i < tiles.length; i += 1) {
            const key = String(tiles[i].beatNumber) + type
            //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
            if (tiles[i].type == type && 
                !tappedTiles.current.includes(key) && 
                !missedTiles.current.includes(key)) {
                closestTileBeatNumber = tiles[i].beatNumber
                tappedTiles.current.push(key)
                break
            }
        }
        if (closestTileBeatNumber != null) {
            //runs the animation
            tileSetStates.current[String(closestTileBeatNumber) + type](2)
        }
    }


    return (
        <div className="tile-generator-wrapper">
            {
                currentTiles.map((tile, index) => 
                    <Tile 
                        type={tile.type} 
                        tileSpeed={tileSpeed} 
                        targetBeatNumber={tile.beatNumber}
                        onMount={onTileMount}
                        onMiss={onTileMiss}
                        key={tile.id}
                    ></Tile>
                )
            }
        </div>
    )
}

export default TileGenerator