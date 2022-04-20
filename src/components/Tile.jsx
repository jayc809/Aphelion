import React from 'react'
import "../styles/Tile.css"
import tileImage from "../images/tile.png"

const Tile = ({position, velocity}) => {
    return (
        <div className="tile">
            <img src={tileImage} alt="tile"/>
        </div>
    )
}

export default Tile