import React from 'react';
import HoldTile from './GameViewComponents/HoldTile';
import Platform from './GameViewComponents/Platform';
import "./GameView.css"

const TestView = () => {

    return (
        <div>
            <div className="component" id="tile-generator">
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
            </div>
        </div>
    );
};

export default TestView;