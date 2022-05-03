import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const Tile = ({ type, updateScore, move}) => {

    const tileRef = useRef(null)
    const tileSpeed = 1
    const repeatTimes = 1
    const timingFunction = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const currFrameRef = useRef(0)
    const positionIntervalRef = useRef(null)
    const rerenderRate = 50
    const totalFrames = tileSpeed / (50 / 1000)
    const [show, setShow] = useState(true)
    const perfect = 1, great = 2, good = 3

    const getPosition = () => {
        console.log(currFrameRef.current)
        if (currFrameRef.current >= totalFrames) {
            updateScore("miss")
            initializePositionInterval()
        }
        if (currFrameRef.current == 0) {
            setShow(true)
        }
        currFrameRef.current += 1
    }

    const initializePositionInterval = () => {
        clearInterval(positionIntervalRef.current)
        positionIntervalRef.current = setInterval(getPosition, rerenderRate)
        currFrameRef.current = 0
    }

    const handleHit = (key) => {
        const accuracy = Math.abs(currFrameRef.current - (totalFrames * 0.8))
        const hit = () => {
            setShow(false)
            initializePositionInterval()
        }
        if (accuracy <= perfect) {
            hit()
            updateScore("perfect")
        } else if (accuracy <= great) {
            hit()
            updateScore("great")
        } else if (accuracy <= good) {
            hit()
            updateScore("good")
        } 
    }

    const handlePress = (e) => {
        const key = e.key
        switch (type) {
            case "left":
                if (key == "d") {
                    handleHit(key)
                }
                break
            case "middleLeft":
                if (key == "f") {
                    handleHit(key)
                }
                break
            case "middleRight":
                if (key == "j") {
                    handleHit(key)
                }
                break
            case "right":
                if (key == "k") {
                    handleHit(key)
                }
                break
        }
    }

    useEffect(() => {
        const tile = tileRef.current
        if (move) {
            switch (type) {
                case "left":
                    tile.style.animation = `move-left ${tileSpeed + "s"} ${repeatTimes} ${timingFunction}`
                    break
                case "middleLeft":
                    tile.style.animation = `move-middle-left ${tileSpeed + "s"} ${repeatTimes} ${timingFunction}`
                    break
                case "middleRight":
                    tile.style.animation = `move-middle-right ${tileSpeed + "s"} ${repeatTimes} ${timingFunction}`
                    break
                case "right":
                    tile.style.animation = `move-right ${tileSpeed + "s"} ${repeatTimes} ${timingFunction}`
                    break
            }
            // initializePositionInterval()
            return () => {
                // clearInterval(positionIntervalRef.current)
            }
        }
    }, [move])

    useEffect(() => {
        window.addEventListener("keypress", handlePress)
        return () => {
            window.removeEventListener("keypress", handlePress)
        }
    }, [])

    return (
        <div className="tile-wrapper">
            <div className="tile" ref={tileRef}>
                <img 
                    src={tileImage} 
                    alt="tile"
                    style={{opacity: show ? 1 : 0}}
                />
            </div>
        </div>
    )
    
}

export default Tile