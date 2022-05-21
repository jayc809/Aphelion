import React, { useCallback, useEffect, useState } from 'react';
import HoldTile from './GameViewComponents/HoldTile';
import Platform from './GameViewComponents/Platform';
import "./GameView.css"

const TestView = () => {

    const arr = [{num: 1}, {num: 2}, {num: 3}, {num: 4}]
    useEffect(() => {
        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i].num == 3) {
                arr[i - 1].num = 10
            }
        }
        console.log(arr)
    })

    return (
        <div>
            {/* <div className="component" id="tile-generator">
                <HoldTile
                type={"right"}
                tileSpeed={1.3}
                targetBeatNumber={0}
                elaspedTime={1.3}
                onMount={(a, b, c)=> {}} 
                onMiss={(a, b)=>{}}
                id={1}
                ></HoldTile>
            </div>
            <div className="component" id="platform"> 
                <Platform/>
            </div> */}
        </div>
    );
};

export default TestView;