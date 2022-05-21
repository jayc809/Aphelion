import React, { useCallback, useEffect, useRef, useState } from 'react'
import Tile from "./Tile"
import HoldTile from './HoldTile'
import "../styles/TileGenerator.css"
import TestView from '../TestView'

const TileGenerator = ({ beatmapObj, onMount, tileSpeed, updateScoreAndCombo, getAllowStart }) => {

    const [beatmapIndex, setBeatmapIndex] = useState(null)
    const [currentTiles, setCurrentTiles] = useState(
        Array.apply(null, Array(30)).map((nul, index) => {
            return {beatNumber: -1, type: "placeholder", id: index - 30}
        })
    )
    const currentTilesRef = useRef(currentTiles)
    const currTimeRef = useRef(null)

    useEffect(() => {
        onMount(handleTimeChange, pauseTiles, playTiles)
        window.addEventListener("keydown", handleDown)
        window.addEventListener("keyup", handleUp)
        return () => {
            window.removeEventListener("keydown", handleDown)
            window.removeEventListener("keyup", handleUp)
        }
    }, [])

    const handleTimeChange = (currTime) => {
        currTimeRef.current = currTime
        for (let i = parseInt((currTime - beatmapObj.startTime) / (beatmapObj.totalTime - beatmapObj.startTime) * beatmapObj.beatmap.length) - 2;
                 i < parseInt((currTime - beatmapObj.startTime) / (beatmapObj.totalTime - beatmapObj.startTime) * beatmapObj.beatmap.length) + 4; 
                 i += 1) {
            if (i < 0) {
                i = 0
            } else if (i >= beatmapObj.beatmap.length) {
                console.log("reached end")
                break
            }
            if (currTime >= beatmapObj.beatmap[i].time - beatmapObj.refreshTolerance &&
                currTime <= beatmapObj.beatmap[i].time + beatmapObj.refreshTolerance)  {
                setBeatmapIndex(i)
                // console.log(currTime)
                // console.log("found at " + i)
                break
            } 
            if (currTime < beatmapObj.beatmap[i].time - 2 * beatmapObj.refreshTolerance) {
                break
            }
        }
    }

    useEffect(() => {
        if (beatmapIndex != null) {
            const tilesToAppend = beatmapObj.beatmap[beatmapIndex].tiles
            if (tilesToAppend.length > 0) {
                setCurrentTiles(currentTiles.slice(tilesToAppend.length, currentTiles.length).concat(tilesToAppend))
            }
        }
    }, [beatmapIndex])

    //bad fix
    useEffect(() => {
        currentTilesRef.current = currentTiles
    }, [currentTiles])

    const dPressed = useRef(false)
    const fPressed = useRef(false)
    const jPressed = useRef(false)
    const kPressed = useRef(false)
    const handleDown = (e) => {
        if (getAllowStart()) {
            switch (e.key) {
                case "d":
                    if (!dPressed.current) {
                        dPressed.current = true
                        onTileTap("left")
                    }
                    break
                case "f":
                    if (!fPressed.current) {
                        fPressed.current = true
                        onTileTap("middle-left")
                    }
                    break
                case "j":
                    if (!jPressed.current) {
                        jPressed.current = true
                        onTileTap("middle-right")
                    }
                    break
                case "k":
                    if (!kPressed.current) {
                        kPressed.current = true
                        onTileTap("right")
                    }
                    break
            }
        }
    }

    const handleUp = (e) => {
        switch (e.key) {
            case "d":
                dPressed.current = false
                onTileRelease("left")
                break
            case "f":
                fPressed.current = false
                onTileRelease("middle-left")
                break
            case "j":
                jPressed.current = false
                onTileRelease("middle-right")
                break
            case "k":
                kPressed.current = false
                onTileRelease("right")
                break
        }
    }

    //sets up a dictionary of setStates for each tile mounted
    const tileControllers = useRef({})
    const onTileMount = (type, targetTime, controller) => {
        const key = type + String(targetTime)
        tileControllers.current[key] = controller
    }
    //sets up list of missed tiles
    const missedTiles = useRef([])
    const onTileMiss = (type, targetTime) => {
        const key = type + String(targetTime)
        missedTiles.current.push(key)
        updateScoreAndCombo("miss")
        if (missedTiles.current.length > 30) {
            missedTiles.current.shift()
        }
    }
    //finds the closest tile of type and starts animation using setState
    const tappedTiles = useRef([])
    const onTileTap = (type) => {
        let closestTargetTime = null
        //makes a copy of currentTiles
        const tiles = JSON.parse(JSON.stringify(currentTilesRef.current))
        for (let i = 0; i < tiles.length; i += 1) {
            const key = type + String(tiles[i].targetTime)
            //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
            if (tiles[i].type == type && 
                !tappedTiles.current.includes(key) && 
                !missedTiles.current.includes(key)) {
                closestTargetTime = tiles[i].targetTime
                tappedTiles.current.push(key)
                if (tappedTiles.current.length > 30) {
                    tappedTiles.current.shift()
                }
                break
            }
        }
        if (closestTargetTime != null) {
            //runs the animation
            const key = type + String(closestTargetTime)
            const controller = tileControllers.current[key]
            const accuracy = getTileAccuracy(closestTargetTime)
            console.log(currTimeRef.current)
            console.log(closestTargetTime)
            if (controller("getClass") == "tap") {
                controller("tap")
                updateScoreAndCombo(accuracy)
            }
            else if (controller("getClass") == "hold") {
                controller("hold", accuracy)
                updateScoreAndCombo(accuracy)
            }

        }
    }
    const getTileAccuracy = (closestTargetTime) => {
        const processTimeOffset = 0.05
        const tileCrossTime = closestTargetTime + (tileSpeed * 0.86) - processTimeOffset //by cubic bezier animation of tile movement
        const accuracyUnit = tileSpeed / 14
        const timeDifference = Math.abs(currTimeRef.current - tileCrossTime)
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

    const onTileRelease = (type) => {
        let closestTileBeatNumber = null
        //makes a copy of currentTiles
        const tiles = JSON.parse(JSON.stringify(currentTilesRef.current))
        for (let i = 0; i < tiles.length; i += 1) {
            const key = String(tiles[i].beatNumber) + type
            //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
            if (tiles[i].type == type && 
                tappedTiles.current.includes(key) &&
                !missedTiles.current.includes(key)) {
                closestTileBeatNumber = tiles[i].beatNumber
                missedTiles.current.push(key)
                if (missedTiles.current.length > 30) {
                    missedTiles.current.shift()
                }
                break
            }
        }
        if (closestTileBeatNumber != null) {
            const controller = tileControllers.current[String(closestTileBeatNumber) + type]
            if (controller("getClass") == "hold") {
                controller("release")
            }
        }
    }
    
    const pauseTiles = () => {
        const tiles = JSON.parse(JSON.stringify(currentTilesRef.current))
        for (let i = 0; i < tiles.length; i += 1) {
            const key = tiles[i].type + String(tiles[i].targetTime)
            //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
            if (!tappedTiles.current.includes(key) && 
                !missedTiles.current.includes(key)) {
                tileControllers.current[key]("pauseAnimation")
            }
        }
    }

    const playTiles = () => {
        const tiles = JSON.parse(JSON.stringify(currentTilesRef.current))
        for (let i = 0; i < tiles.length; i += 1) {
            const key = tiles[i].type + String(tiles[i].targetTime)
            //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
            if (!tappedTiles.current.includes(key) && 
                !missedTiles.current.includes(key)) {
                tileControllers.current[key]("playAnimation")
            }
        }
    }

    return (
        <div className="tile-generator-wrapper">
            {
                currentTiles.map((tile, index) => {
                    switch (tile.class) {
                        case "tap":
                            return <Tile 
                                type={tile.type} 
                                tileSpeed={tileSpeed} 
                                targetTime={tile.targetTime}
                                onMount={onTileMount}
                                onMiss={onTileMiss}
                                id={tile.id}
                                key={tile.id}
                            ></Tile>
                        case "hold":
                            return <HoldTile 
                                type={tile.type} 
                                tileSpeed={tileSpeed} 
                                targetBeatNumber={tile.beatNumber}
                                elapsedBeat={tile.elapsedBeat}
                                elapsedTime={tile.elapsedTime}
                                onMount={onTileMount}
                                onMiss={onTileMiss}
                                updateScoreAndCombo={updateScoreAndCombo}
                                id={tile.id}
                                key={tile.id}
                            ></HoldTile>
                    }
                })
            }
        </div>
    )
}

export default TileGenerator