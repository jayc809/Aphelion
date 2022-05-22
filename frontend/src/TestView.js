import React, { useCallback, useEffect, useState } from 'react';
import HoldTile from './GameViewComponents/HoldTile';
import Platform from './GameViewComponents/Platform';
import "./GameView.css"

const TestView = () => {

    // const arr = [{tiles: [{class: 1}, {class: 2}, {class: 3}]}, 
    // {tiles: [{class: 1}, {class: 2}, {class: 3}]},
    // {tiles: [{class: 1}, {class: 2}, {class: 3}]},
    // {tiles: [{class: 1}, {class: 2}, {class: 3}]}]
    // useEffect(() => {
    //     arr.forEach((t) => {
    //         t.tiles = t.tiles.filter((tile) => {return tile.class != 1})
    //     })
    //     console.log(arr)
    // })

    return (
        <div>
            <div className="component" id="tile-generator">
                <HoldTile
                type={"right"}
                tileSpeed={1.3}
                targetTime={0}
                elapseBeatCount={8}
                elapseTime={2.6390591754039683
                }
                onMount={(a, b, c)=> {}} 
                onMiss={(a, b)=>{}}
                updateScoreAndCombo={(a)=>{}}
                id={1}
                ></HoldTile>
            </div>
            <div className="component" id="platform"> 
                <Platform/>
            </div>
        </div>
    );
};

export default TestView;