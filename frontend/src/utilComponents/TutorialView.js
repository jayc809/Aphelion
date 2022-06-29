import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainedTileView from './ContainedTileView';
import Platform from '../GameViewComponents/Platform';
import StartMessage from '../GameViewComponents/StartMessage';
import PauseMenu from '../GameViewComponents/PauseMenu';

const TutorialView = ({ showView, process, showSettings, hideSettings, setVideoInfoMuted, setInTutorial, settingsObj }) => {

    const [step, setStep] = useState(0)
    const maxStep = {
        "videoSelector": 6,
        "game" : 6
    } [process]
    const [clip, setClip] = useState("")
    const [completed, setCompleted] = useState({
        "videoSelector": localStorage.getItem("completed-video-selector-tutorial") ? true : false,
        "game": localStorage.getItem("completed-game-tutorial") ? true : false
    }[process])
    const [nextButtonText, setNextButtonText] = useState("Next")
    const [backButtonText, setBackButtonText] = useState("Exit")

    useEffect(() => {
        if (process == "videoSelector") {
            if (localStorage.getItem("completed-video-selector-tutorial")) {
                setVideoInfoMuted(false)
            } else {
                setVideoInfoMuted(true)
            }
        } else if (process == "game") {
            if (localStorage.getItem("completed-game-tutorial")) {
                setInTutorial(false)
            } else {
                setInTutorial(true)
            }
        }
    }, [])
    
    const showingSettingRef = useRef(false)
    useEffect(() => {
        if (process == "videoSelector") {
            setClip({
                1: "polygon(3.6vw 0vh, 3.6vw calc(8vh + 6.5vw), 55.6vw calc(8vh + 6.5vw), 55.6vw 8vh, 3.6vw 8vh, 3.6vw 0vh, 100vw 0vh, 100vw 100vh, 0vw 100vh, 0vw 0vh)",
                2: "polygon(57vw 0vh, 41.2vw 100vh, 0vw 100vh, 0vw 0vh, 100vw 0vh, 100vw 100vh, 92.2vw 100vh, 100vw 42vh, 100vw 0vh)",
                3: "polygon(25.8vw 0vh, 25.8vw calc(84.4vh + 6.5vw), 46.3vw calc(84.4vh + 6.5vw), 46.3vw 84.4vh, 3.6vw 84.4vh, 3.6vw 0vh, 100vw 0vh, 100vw 100vh, 0vw 100vh, 0vw 0vh)",
                4: "polygon(0vw 0vh, 55vw 0vh, 55vw 100vh, 0vw 100vh)",
                5: "polygon(25.8vw 0vh, 25.8vw calc(84.4vh + 6.5vw), 46.3vw calc(84.4vh + 6.5vw), 46.3vw 84.4vh, 3.6vw 84.4vh, 3.6vw 0vh, 100vw 0vh, 100vw 100vh, 0vw 100vh, 0vw 0vh)",
            } [step])
        } else if (process == "game") {
            setClip({
                1: "polygon(14.8vw 100vh, 85.4vw 100vh, 55vw 40vh, 45vw 40vh, 45vw 0vh, 100vw 0vh, 100vw 100vh, 0vw 100vh, 0vw 0vh, 45vw 0vh, 45vw 40vh)",
                2: "polygon(14.8vw 100vh, 85.4vw 100vh, 55vw 40vh, 45vw 40vh, 45vw 0vh, 100vw 0vh, 100vw 100vh, 0vw 100vh, 0vw 0vh, 45vw 0vh, 45vw 40vh)",
                3: "polygon(14.8vw 100vh, 85.4vw 100vh, 55vw 40vh, 45vw 40vh, 45vw 0vh, 100vw 0vh, 100vw 100vh, 0vw 100vh, 0vw 0vh, 45vw 0vh, 45vw 40vh)",
                4: "polygon(0vw 40vh, 100vw 40vh, 100vw 0vh, 0vw 0vh)",
                5: "polygon(0vw 20vh, 100vw 20vh, 100vw 0vh, 0vw 0vh)",
            } [step])
        }
        if (process == "videoSelector") {
            if (step == 4 && !showingSettingRef.current) {
                showSettings()
                showingSettingRef.current = true
            } else if (step == 3 && showingSettingRef.current) {
                hideSettings()
                showingSettingRef.current = false
            }
        }
        if (step == maxStep) {
            setNextButtonText("Complete")
            setBackButtonText("Back")
        } else if (step == 0) {
            setNextButtonText("Next")
            setBackButtonText("Exit")
        }
        else {
            setNextButtonText("Next")
            setBackButtonText("Back")
        }
    }, [step])

    const handleStepIncrement = useCallback(() => {
        if (step < maxStep) {
            setStep(step + 1)
        } else {
            if (process == "videoSelector") {
                hideSettings()
                localStorage.setItem("completed-video-selector-tutorial", true)
                setVideoInfoMuted(false)
            }
            else if (process == "game") {
                localStorage.setItem("completed-game-tutorial", true)
                setInTutorial(false)
            }
            setCompleted(true)
        }
    }, [step])

    const handleStepDecrement = useCallback(() => {
        if (step > 0) {
            setStep(step - 1)
        } else {
            if (process == "videoSelector") {
                hideSettings()
            }
        }
    }, [step])

    return (
        completed ? 
        "" :
        <div style={{position: "absolute", zIndex: 90000, height: "100vh", width: "100vw", display: "grid", placeItems: "center", overflow: "hidden", opacity: showView ? 1 : 0}}>
            {
                process == "videoSelector" ? 
                {
                    1: <div style={{position: "absolute", zIndex: 20, height: "6.5vw", width: "52vw", border: "white 0.2vh solid", top: "8vh", left: "3.6vw"}}></div>,
                    2: <div style={{position: "absolute", zIndex: 20, height: "150vh", width: "48vw", border: "white 0.2vh solid", top: "-25vh", right: "2vw", transform: "rotate(15deg)"}}></div>,
                    3: <div style={{position: "absolute", zIndex: 20, height: "6.5vw", width: "20.2vw", border: "white 0.2vh solid", top: "84vh", left: "25.8vw"}}></div>,
                    4: <div style={{position: "absolute", zIndex: 20, height: "100vh", width: "43.4vw", border: "white 0.2vh solid", top: "0vh", left: "55vw", boxSizing: "border-box"}}></div>,
                    5: <div style={{position: "absolute", zIndex: 20, height: "6.5vw", width: "20.2vw", border: "white 0.2vh solid", top: "84vh", left: "25.8vw"}}></div>,
                } [step] :
                {
                    2: <ContainedTileView type="tap" settingsObj={settingsObj} key={1}></ContainedTileView>,
                    3: <ContainedTileView type="hold" settingsObj={settingsObj} key={2}></ContainedTileView>,
                    4: <ContainedTileView type="circle" settingsObj={settingsObj} key={3}></ContainedTileView>,
                } [step]
            }
            {
                process == "videoSelector" ? 
                {
                    0: <div style={{position: "absolute", zIndex: 30, height: "20vh", width: "100vw", top: "40vh", left: "0vw", color: "white"}}>
                        <div style={{paddingBottom: "3vh", width: "100%", fontSize: "6vh", textAlign: "center"}}>Welcome to Aphelion!</div>
                        <div style={{paddingBottom: "1vh", width: "100%", fontSize: "4vh", textAlign: "center"}}>It seems like it's your first time here,</div>
                        <div style={{width: "100%", fontSize: "4vh", textAlign: "center"}}>so here's a quick tutorial for you</div>
                       </div>,
                    1: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "8vh", left: "58vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>1. Search for ANY song you like</div>,
                    2: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "44vh", left: "10vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>2. Select your song from the list</div>,
                    3: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "70vh", left: "22vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>3. Click Continue to advance</div>,
                    4: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "44vh", left: "24vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>4. Choose your settings</div>,
                    5: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "70vh", left: "22vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>5. Click Start to begin game</div>,
                    6: <div style={{position: "absolute", zIndex: 30, height: "20vh", width: "100vw", top: "44vh", left: "0vw", color: "white"}}>
                        <div style={{paddingBottom: "3vh", width: "100%", fontSize: "6vh", textAlign: "center"}}>You made it!</div>
                        <div style={{paddingBottom: "1vh", width: "100%", fontSize: "4vh", textAlign: "center"}}>Go choose your favorite song and start the game!</div>
                       </div>,
                } [step] :
                {
                    0: <div style={{position: "absolute", zIndex: 30, height: "20vh", width: "100vw", top: "40vh", left: "0vw", color: "white"}}>
                        <div style={{paddingBottom: "3vh", width: "100%", fontSize: "6vh", textAlign: "center"}}>Welcome to the game!</div>
                        <div style={{paddingBottom: "1vh", width: "100%", fontSize: "4vh", textAlign: "center"}}>It seems like it's your first time here,</div>
                        <div style={{width: "100%", fontSize: "4vh", textAlign: "center"}}>so here's a quick tutorial for you</div>
                       </div>,
                    1: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "100vw", top: "24vh", left: "0vw", color: "white", display: "flex", placeContent: "center", fontSize: "4vh"}}>1. Press the keys corresponding to each lane and see them light up</div>,
                    2: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "100vw", top: "24vh", left: "0vw", color: "white", display: "flex", placeContent: "center", fontSize: "4vh"}}>2. Hit the Tap Notes when they cross the line</div>,
                    3: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "100vw", top: "24vh", left: "0vw", color: "white", display: "flex", placeContent: "center", fontSize: "4vh"}}>3. Hit the Hold Notes and hold until they fully cross the line</div>,
                    4: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "100vw", top: "24vh", left: "0vw", color: "white", display: "flex", placeContent: "center", fontSize: "4vh"}}>4. Hit the Circle Notes when they fill their circle (Extreme Difficulty Only)</div>,
                    5: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "100vw", top: "16vh", left: "0vw", color: "white", display: "flex", placeContent: "center", fontSize: "4vh"}}>5. Press P to toggle the Pause Menu</div>,
                    6: <div style={{position: "absolute", zIndex: 30, height: "20vh", width: "100vw", top: "44vh", left: "0vw", color: "white"}}>
                        <div style={{paddingBottom: "3vh", width: "100%", fontSize: "6vh", textAlign: "center"}}>That is all, are you ready?</div>
                        <div style={{paddingBottom: "1vh", width: "100%", fontSize: "4vh", textAlign: "center"}}>Click complete to start the game!</div>
                       </div>,
                } [step]
            }
            {/* <div style={{position: "absolute", zIndex: 30, top: "2.2vh", left: "2.2vh", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>Tutorial</div> */}
            <button className="next-button" onClick={handleStepIncrement} style={{zIndex: 1000, height: "8vh", cursor: "pointer", position: "absolute", left: "70vw", top: "88vh"}}>{nextButtonText}</button>
            <button className="back-button" onClick={handleStepDecrement} style={{zIndex: 1001, height: "8vh", cursor: "pointer", position: "absolute", right: "70vw", top: "88vh", opacity: process == "game" && step == 0 ? 0 : 1}}>{backButtonText}</button>
            {
                process == "game" && step == 4 && settingsObj.difficulty != "Extrme" ? 
                <div className="component" id="start-message">
                    <StartMessage getAllowStart={true} difficulty="Extreme" inTutorial={true}/>
                </div> : 
                ""
            }
            {
                process == "game" && step == 4 && settingsObj.difficulty != "Extrme" ? 
                <div className="component" id="platform"> 
                    <Platform settingsObj={{difficulty: "Extreme"}}/>
                </div> :
                ""
            }
            {
                process == "game" && step == 5 ? 
                <div className="component" id="pause-menu" style={{zIndex: 5}}>
                    <PauseMenu pauseGame={() => {}} restartGame={() => {}} endGame={() => {}} settingsObj={settingsObj} setSettingsObj={() => {}}/>
                </div> :
                ""
            }
            {
                process == "game" && step == 5 ? 
                <div style={{position: "absolute", zIndex: 10000, height: "80vh", width: "100vw", top: "0vh"}}></div> :
                ""
            }
            <div style={{position: "absolute", zIndex: 10, height: "100vh", width: "100vw", backgroundColor: "black", opacity: {"videoSelector": step == 0 || step == maxStep ? "0.9" : "0.8", "game": "0.9"}[process], clipPath: clip}}></div>
        </div> //: ""
    );
};

export default TutorialView;