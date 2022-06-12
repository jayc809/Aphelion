import React, { useEffect, useRef, useState } from 'react'
import Tile from "./Tile"
import HoldTile from './HoldTile'
import "../styles/TileGenerator.css"
import CircleTile from './CircleTile'
import HalfTile from './HalfTile'

const TileGenerator = ({ beatmapObj, onMount, tileSpeed, updateScoreAndCombo, getAllowStart, theme, difficulty }) => {

    const [beatmapIndex, setBeatmapIndex] = useState(null)
    const [currentTiles, setCurrentTiles] = useState(
        Array.apply(null, Array(60)).map((nul, index) => {
            return {beatNumber: -1, type: "placeholder", id: index - 60}
        })
    )
    const currentTilesRef = useRef(currentTiles)
    const currTimeRef = useRef(null)

    useEffect(() => {
        onMount(handleTimeChange, pauseTiles, playTiles, disableKeyboard)
        window.addEventListener("keydown", handleDown)
        window.addEventListener("keyup", handleUp)
        return () => {
            window.removeEventListener("keydown", handleDown)
            window.removeEventListener("keyup", handleUp)
        }
    }, [])

    const allowKeyboardRef = useRef(true)
    const disableKeyboard = (disable) => {
        if (disable) {
            allowKeyboardRef.current = false
        } else {
            allowKeyboardRef.current = true
        }
    }

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
    const sPressed = useRef(false)
    const lPressed = useRef(false)

    const handleDown = (e) => {
        if (getAllowStart() && allowKeyboardRef.current) {
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
                case "s":
                    if (!sPressed.current && difficulty == "Extreme") {
                        sPressed.current = true
                        onTileTap("left-circle")
                    }
                    break
                case "l":
                    if (!lPressed.current && difficulty == "Extreme") {
                        lPressed.current = true
                        onTileTap("right-circle")
                    }
                    break
                default:
                    break
            }
        }
    }

    const handleUp = (e) => {
        if (allowKeyboardRef.current) {
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
                case "s":
                    if (difficulty == "Extreme") {
                        sPressed.current = false
                        onTileRelease("left-circle")
                    }
                    break
                case "l":
                    if (difficulty == "Extreme") {
                        lPressed.current = false
                        onTileRelease("right-circle")
                    }
                    break
                default:
                    break
            }
        }
    }

    //sets up a dictionary of setStates for each tile mounted
    const tileControllers = useRef({})
    const onTileMount = (type, targetTime, controller) => {
        const key = type + String(targetTime)
        tileControllers.current[key] = controller
    }
    //sets up list of missed tiles
    const onTileMiss = (type, targetTime) => {
        updateScoreAndCombo("miss")
    }
    //finds the closest tile of type and starts animation using setState
    const tappedTiles = useRef([])
    const onTileTap = (type) => {
        let closestTargetTime = null
        //makes a copy of currentTiles
        const tiles = [...currentTilesRef.current]
        for (let i = 0; i < tiles.length; i += 1) {
            const key = type + String(tiles[i].targetTime)
            //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
            if (tiles[i].type == type && 
                !tappedTiles.current.includes(key) && 
                currTimeRef.current < (tiles[i].targetTime + tileSpeed)) {
                closestTargetTime = tiles[i].targetTime
                tappedTiles.current.push(key)
                if (tappedTiles.current.length > 60) {
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
            if (controller("getClass") == "tap") {
                controller("tap", accuracy)
            } else if (controller("getClass") == "hold") {
                controller("hold", accuracy)
            } else if (controller("getClass") == "circle") {
                controller("tap", accuracy)
            }
            updateScoreAndCombo(accuracy)
        }
    }
    const getTileAccuracy = (closestTargetTime) => {
        const targetCrossTime = closestTargetTime + (tileSpeed * 0.84)
        const accuracyUnit = tileSpeed / 14
        const timeDifference = Math.abs(currTimeRef.current - targetCrossTime)
        if (timeDifference <= accuracyUnit) {
            return "perfect"
        } else if (timeDifference <= 1 * accuracyUnit) {
            return "great"
        } else if (timeDifference <= 3 * accuracyUnit) {
            return "good"
        } else {
            return "miss"
        }
    }

    const releasedHoldTiles = useRef([])
    const onTileRelease = (type) => {
        let closestTargetTime = null
        //makes a copy of currentTiles
        const tiles = [...currentTilesRef.current]
        for (let i = 0; i < tiles.length; i += 1) {
            const key = type + String(tiles[i].targetTime)
            //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
            if (tiles[i].type == type && 
                tiles[i].class == "hold" &&
                tappedTiles.current.includes(key) &&
                currTimeRef.current < (tiles[i].targetTime + tiles[i].elapseTime + tileSpeed) &&
                !releasedHoldTiles.current.includes(key)
                ) {
                closestTargetTime = tiles[i].targetTime
                releasedHoldTiles.current.push(key)
                if (releasedHoldTiles.current.length > 10) {
                    releasedHoldTiles.current.shift()
                }
                break
            }
        }
        if (closestTargetTime != null) {
            const key = type + String(closestTargetTime)
            const controller = tileControllers.current[key]
            if (controller("getClass") == "hold") {
                controller("release")
            }
        }
    }
    
    const pauseTiles = () => {
        const tiles = currentTilesRef.current
        const pause = () => {
            for (let i = 0; i < tiles.length; i += 1) {
                const key = tiles[i].type + String(tiles[i].targetTime)
                //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
                if (!tappedTiles.current.includes(key) && 
                    key in tileControllers.current) {
                    tileControllers.current[key]("pauseAnimation")
                }
            }
        }
        pause()
        setTimeout(() => {
            pause()
        }, 300);
    }

    const playTiles = () => {
        const tiles = currentTilesRef.current
        const play = () => {
            for (let i = 0; i < tiles.length; i += 1) {
                const key = tiles[i].type + String(tiles[i].targetTime)
                //finds the first instance in currentTiles where the tile is of type and has not been tapped yet
                if (!tappedTiles.current.includes(key) && 
                    key in tileControllers.current) {
                    tileControllers.current[key]("playAnimation")
                }
            }
        }
        play()
        setTimeout(() => {
            play()
        }, 300);
    }

    return (
        <div className="screen">
            <div className="tile-generator-wrapper">
                {
                    currentTiles.map((tile, index) => {
                        switch (tile.class) {
                            case "tap":
                                return <Tile 
                                    type={tile.type} 
                                    tileSpeed={tileSpeed} 
                                    targetTime={tile.targetTime}
                                    theme={theme}
                                    onMount={onTileMount}
                                    onMiss={onTileMiss}
                                    id={tile.id}
                                    key={tile.id}
                                ></Tile>
                            case "hold":
                                return <HoldTile 
                                    type={tile.type} 
                                    tileSpeed={tileSpeed} 
                                    targetTime={tile.targetTime}
                                    theme={theme}
                                    elapseBeatCount={tile.elapseBeatCount}
                                    elapseTime={tile.elapseTime}
                                    onMount={onTileMount}
                                    onMiss={onTileMiss}
                                    updateScoreAndCombo={updateScoreAndCombo}
                                    id={tile.id}
                                    key={tile.id}
                                ></HoldTile>
                            case "half": 
                                return <HalfTile 
                                    type={tile.type} 
                                    tileSpeed={tileSpeed} 
                                    targetTime={tile.targetTime}
                                    theme={theme}
                                    delay={30 / beatmapObj.bpm}
                                    onMount={onTileMount}
                                    onMiss={onTileMiss}
                                    id={tile.id}
                                    key={tile.id}
                                ></HalfTile>
                            case "circle":
                                return <CircleTile 
                                    type={tile.type} 
                                    tileSpeed={tileSpeed} 
                                    targetTime={tile.targetTime}
                                    theme={theme}
                                    onMount={onTileMount}
                                    onMiss={onTileMiss}
                                    id={tile.id}
                                    key={tile.id}
                                ></CircleTile>
                            default:
                                console.log("error in tile generator")
                                return
                        }
                    })
                }
            </div>
            <div className="video-progress-bar" style={{width: `calc(${beatmapIndex / beatmapObj.beatmap.length} * 100vw)`}}></div>
        </div>
    )
}

export default TileGenerator