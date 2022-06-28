import React, { useCallback, useEffect, useRef, useState } from 'react';

const TutorialView = ({ showView, process, showSettings, hideSettings }) => {

    const [step, setStep] = useState(0)
    const maxStep = process == "videoSelector" ? 5 : 3
    const [clip, setClip] = useState("")
    const [completed, setCompleted] = useState({
        "videoSelector": localStorage.getItem("completed-video-selector-tutorial") ? true : false,
        "game": localStorage.getItem("completed-game-tutorial") ? true : false
    }[process])
    const [nextButtonText, setNextButtonText] = useState("Next")
    const [backButtonText, setBackButtonText] = useState("Exit")

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
        }
        if (process == "videoSelector") {
            if (step == 4 && !showingSettingRef.current) {
                showSettings()
                showingSettingRef.current = true
            } else if (step == 3 && showingSettingRef.current) {
                hideSettings()
                showingSettingRef.current = false
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
        }
    }, [step])

    const handleStepIncrement = useCallback(() => {
        if (step < maxStep) {
            setStep(step + 1)
        } else {
            hideSettings()
            localStorage.setItem("completed-video-selector-tutorial", true)
            setCompleted(true)
        }
    }, [step])

    const handleStepDecrement = useCallback(() => {
        if (step > 0) {
            setStep(step - 1)
        } else {
            hideSettings()
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
                    2:  <div style={{position: "absolute", zIndex: 20, height: "150vh", width: "48vw", border: "white 0.2vh solid", top: "-25vh", right: "2vw", transform: "rotate(15deg)"}}></div>,
                    3: <div style={{position: "absolute", zIndex: 20, height: "6.5vw", width: "20.2vw", border: "white 0.2vh solid", top: "84vh", left: "25.8vw"}}></div>,
                    4: <div style={{position: "absolute", zIndex: 20, height: "100vh", width: "43.4vw", border: "white 0.2vh solid", top: "0vh", left: "55vw", boxSizing: "border-box"}}></div>,
                    5: <div style={{position: "absolute", zIndex: 20, height: "6.5vw", width: "20.2vw", border: "white 0.2vh solid", top: "84vh", left: "25.8vw"}}></div>,
                } [step] :
                {

                } [step]
            }
            {
                process == "videoSelector" ? 
                {
                    0: <div style={{position: "absolute", zIndex: 30, height: "12vh", width: "100vw", top: "44vh", left: "0vw", color: "white"}}>
                        <div style={{paddingBottom: "2vh", width: "100%", fontSize: "6vh", textAlign: "center"}}>Welcome to Aphelion!</div>
                        <div style={{width: "100%", fontSize: "4vh", textAlign: "center"}}>Here's the tutorial to get things going</div>
                       </div>,
                    1: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "8vh", left: "58vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>1. Search for any song you like</div>,
                    2: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "30vw", top: "40vh", left: "15vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>2. Select your song</div>,
                    3: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "70vh", left: "22vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>3. Click Continue to advance</div>,
                    4: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "44vh", left: "18vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>4. Choose your settings</div>,
                    5: <div style={{position: "absolute", zIndex: 30, height: "6.5vw", width: "42vw", top: "70vh", left: "22vw", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>5. Click Start to begin game</div>,
                } [step] :
                {

                } [step]
            }
            {/* <div style={{position: "absolute", zIndex: 30, top: "2.2vh", left: "2.2vh", color: "white", display: "flex", placeItems: "center", fontSize: "4vh"}}>Tutorial</div> */}
            <button className="next-button" onClick={handleStepIncrement} style={{zIndex: 40, height: "8vh", cursor: "pointer", position: "absolute", left: "70vw", top: "88vh"}}>{nextButtonText}</button>
            <button className="back-button" onClick={handleStepDecrement} style={{zIndex: 41, height: "8vh", cursor: "pointer", position: "absolute", right: "70vw", top: "88vh"}}>{backButtonText}</button>
            <div style={{position: "absolute", zIndex: 10, height: "100vh", width: "100vw", backgroundColor: "black", opacity: step == 0 ? "0.9" : "0.75", clipPath: clip}}></div>
        </div>
    );
};

export default TutorialView;