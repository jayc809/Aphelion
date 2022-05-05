import React, { useEffect, useRef, useState } from 'react'
import Tile from "./Tile"
import "../styles/TileGenerator.css"

const TileGenerator = ({ beatmapObj, onMount, tileSpeed, updateScoreAndCombo, getAllowStart, getCurrVideoTime }) => {

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
        if (getAllowStart()) {
            switch (e.key) {
                case "d":
                    onTileTap("left")
                    break
                case "f":
                    onTileTap("middle-left")
                    break
                case "j":
                    onTileTap("middle-right")
                    break
                case "k":
                    onTileTap("right")
                    break
            }
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
        updateScoreAndCombo("miss")
    }
    //finds the closest tile of type and starts animation using setState
    const tappedTiles = useRef([])
    const onTileTap = (type) => {
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
            //calculate accuracy and update score and combo
            const accuracy = getTileAccuracy(closestTileBeatNumber)
            updateScoreAndCombo(accuracy)
        }
    }
    const getTileAccuracy = (beatNumber) => {
        const processTimeOffset = 0.08
        const currTime = getCurrVideoTime()
        const targetTime = beatmapObj.beatTime[beatNumber - 1] + tileSpeed + processTimeOffset
        const accuracyUnit = tileSpeed / 14
        const timeDifference = Math.abs(currTime - targetTime)
        if (timeDifference <= accuracyUnit) {
            return "perfect"
        } else if (timeDifference <= 2 * accuracyUnit) {
            return "great"
        } else if (timeDifference <= 3 * accuracyUnit) {
            return "good"
        } else {
            return "miss"
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