import React, { useEffect, useRef, useState } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const Tile = ({type, updateScore}) => {

    const tileRef = useRef(null)
    const tileSpeed = 1
    const repeatTimes = 1
    const timingFunction = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"
    const currFrame = useRef(0)
    const rerenderRate = 50
    const totalFrames = tileSpeed / (50 / 1000)
    const [show, setShow] = useState(true)
    const perfect = 1, great = 2, good = 3

    const getPosition = () => {
        currFrame.current += 1
        // console.log(currFrame.current + " out of " + totalFrames)
        if (currFrame.current >= totalFrames) {
            currFrame.current = 0
            setShow(false)
            updateScore("miss")
        }
    }

    const handleHit = (key) => {
        const accuracy = Math.abs(currFrame.current - (totalFrames * 0.8))
        if (accuracy <= perfect) {
            setShow(false)
            updateScore("perfect")
        } else if (accuracy <= great) {
            setShow(false)
            updateScore("great")
        } else if (accuracy <= good) {
            setShow(false)
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
        const positionFinder = setInterval(getPosition, rerenderRate)
        window.addEventListener("keypress", handlePress)

        return () => {
            clearInterval(positionFinder)
            window.removeEventListener("keypress", handlePress)
        }
    })

    if (show) {
        return (
            <div className="tile-wrapper">
                <div className="tile" ref={tileRef}>
                    <img src={tileImage} alt="tile"/>
                </div>
            </div>
        )
    } else {
        return (
            <div ref={tileRef} ></div>
        )
    }
}

export default Tile