import React, { useEffect, useRef } from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"
import { motion } from "framer-motion"

const Tile = ({type}) => {

    const tileRef = useRef(null)

    const tileSpeed = "1s"
    const repeatTimes = 100
    const timingFunction = "cubic-bezier(0.4, 0.1, 0.7, 0.4)"

    useEffect(() => {
        const tile = tileRef.current
        switch (type) {
            case "left":
                tile.style.animation = `move-left ${tileSpeed} ${repeatTimes} ${timingFunction}`
                break
            case "middleLeft":
                tile.style.animation = `move-middle-left ${tileSpeed} ${repeatTimes} ${timingFunction}`
                break
            case "middleRight":
                tile.style.animation = `move-middle-right ${tileSpeed} ${repeatTimes} ${timingFunction}`
                break
            case "right":
                tile.style.animation = `move-right ${tileSpeed} ${repeatTimes} ${timingFunction}`
                break
        }
    })

    return (
        <div className="tile-wrapper">
            <div className="tile" ref={tileRef}>
                <img src={tileImage} alt="tile"/>
            </div>
        </div>

    )
}

export default Tile