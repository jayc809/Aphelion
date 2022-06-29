import React, { useState } from 'react';
import TutorialTile from '../GameViewComponents/TutorialTile';
import TutorialHoldTile from '../GameViewComponents/TutorialHoldTile';
import TutorialCircleTile from '../GameViewComponents/TutorialCircleTile';

const ContainedTileView = ({ type, settingsObj }) => {

    const [index, setIndex] = useState(0)
    const reset = () => {
        setTimeout(() => {     
            setIndex(index + 2)
        }, 800)
    }

    return (
        <div className="component" id="tile-generator" style={{zIndex: 35, filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
            {
                type == "tap" ?
                <div>
                    <TutorialTile type={"middle-left"} tileSpeed={settingsObj.tileSpeed} targetTime={0} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} reset={reset} id={100} key={index}/>
                    <TutorialTile type={"middle-right"} tileSpeed={settingsObj.tileSpeed} targetTime={0} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} reset={reset} id={100} key={index + 1}/>
                </div> :
                ""
            }
            {
                type == "hold" ?
                <div>
                    <TutorialHoldTile type={"left"} tileSpeed={settingsObj.tileSpeed} targetTime={0} elapseTime={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} reset={reset} id={100} key={index}/>
                    <TutorialHoldTile type={"right"} tileSpeed={settingsObj.tileSpeed} targetTime={0} elapseTime={3} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} reset={reset} id={100} key={index + 1}/>
                </div> :
                ""
            }
            {
                type == "circle" ?
                <div>
                    <TutorialCircleTile type={"left-circle"} tileSpeed={settingsObj.tileSpeed} targetTime={0} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} reset={reset} id={100} key={index}/>
                    <TutorialCircleTile type={"right-circle"} tileSpeed={settingsObj.tileSpeed} targetTime={0} onMount={(type, targetTime, controller) => {}} onMiss={(type, targetTime) => {}} updateScoreAndCombo={(accuracy) => {}} reset={reset} id={100} key={index + 1}/>
                </div> :
                ""
            }
        </div>
    );
};

export default ContainedTileView;