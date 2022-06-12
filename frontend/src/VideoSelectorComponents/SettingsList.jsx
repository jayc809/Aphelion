import React, { useEffect, useRef, useState } from 'react';
import "../styles/SettingsList.css"
import StepperButton from './StepperButton';
import darkTheme from "../images/tile.png"
import lightTheme from "../images/tile-light.png"
import settingsBackground from "../images/test-bg.png"

const SettingsList = ({ settingsObj, setSettingsObj, pauseMenu=false, selectedVideo }) => {

    const [difficulty, setDifficulty] = useState(settingsObj.difficulty)
    const [tileSpeed, setTileSpeed] = useState(settingsObj.tileSpeed)
    const [theme, setTheme] = useState(settingsObj.theme)
    const [uiSaturation, setUiSaturation] = useState(settingsObj.uiSaturation)
    const [uiBrightness, setUiBrightness] = useState(settingsObj.uiBrightness)
    const [rainbowUi, setRainbowUi] = useState(settingsObj.rainbowUi)
    const [videoSaturation, setVideoSaturation] = useState(settingsObj.videoSaturation)
    const [videoBrightness, setVideoBrightness] = useState(settingsObj.videoBrightness)
    const [musicStartTime, setMusicStartTime] = useState(settingsObj.musicStartTime)
    const [smoothAnimations, setSmoothAnimations] = useState(settingsObj.smoothAnimations)
    // const [beatNotes, setBeatNotes] = useState(settingsObj.beatNotes)
    const [lowerVolumeOnMisses, setLowerVolumeOnMisses] = useState(settingsObj.lowerVolumeOnMisses)

    const updateSettingObj = (name, val) => {
        const settingsObjCopy = JSON.parse(JSON.stringify(settingsObj))
        settingsObjCopy[name] = val
        setSettingsObj(settingsObjCopy)
    }

    useEffect(() => {
        window.addEventListener("keypress", handleKeyPress)
        if (!pauseMenu) {
            document.getElementById("start-time-input-el").addEventListener("focusout", handleUnFocus)
        }
        return () => {
            window.removeEventListener("keypress", handleKeyPress)
            if (!pauseMenu && document.getElementById("start-time-input-el")) {
                document.getElementById("start-time-input-el").removeEventListener("focusout", handleUnFocus)
            }
        }
    }, [])

    const handleDifficultyChange = () => {
        switch (difficulty) {
            case "Easy":
                setDifficulty("Medium")
                updateSettingObj("difficulty", "Medium")
                break
            case "Medium":
                setDifficulty("Hard")
                updateSettingObj("difficulty", "Hard")
                break
            case "Hard":
                setDifficulty("Extreme")
                updateSettingObj("difficulty", "Extreme")
                break
            case "Extreme":
                setDifficulty("Easy")
                updateSettingObj("difficulty", "Easy")
                break 
            default:
                console.log("error in settings list")
                break
        }
    }

    useEffect(() => {
        updateSettingObj("tileSpeed", tileSpeed)
    }, [tileSpeed])

    const handleThemeToggle = () => {
        if (theme == "light") {
            setTheme("dark")
            updateSettingObj("theme", "dark")
        } else {
            setTheme("light")
            updateSettingObj("theme", "light")
        }
    }

    const handleUiHueChange = (e) => {
        updateSettingObj("uiHue", e.target.value)
    }
    useEffect(() => {
        updateSettingObj("uiSaturation", uiSaturation)
    }, [uiSaturation])

    useEffect(() => {
        updateSettingObj("uiBrightness", uiBrightness)
    }, [uiBrightness])

    const handleRainbowUiToggle = () => {
        if (rainbowUi) {
            setRainbowUi(false)
            updateSettingObj("rainbowUi", false)
        } else {
            setRainbowUi(true)
            updateSettingObj("rainbowUi", true)
        }
    }

    useEffect(() => {
        updateSettingObj("videoSaturation", videoSaturation)
    }, [videoSaturation])

    useEffect(() => {
        updateSettingObj("videoBrightness", videoBrightness)
    }, [videoBrightness])

    const handleSmoothAnimationsToggle = () => {
        if (smoothAnimations) {
            setSmoothAnimations(false)
            updateSettingObj("smoothAnimations", false)
        } else {
            setSmoothAnimations(true)
            updateSettingObj("smoothAnimations", true)
        }
    }

    // const handleBeatNotesToggle = () => {
    //     if (beatNotes) {
    //         setBeatNotes(false)
    //         updateSettingObj("beatNotes", false)
    //     } else {
    //         setBeatNotes(true)
    //         updateSettingObj("beatNotes", true)
    //     }
    // }

    const handleLowerVolumeOnMissesToggle = () => {
        if (lowerVolumeOnMisses) {
            setLowerVolumeOnMisses(false)
            updateSettingObj("lowerVolumeOnMisses", false)
        } else {
            setLowerVolumeOnMisses(true)
            updateSettingObj("lowerVolumeOnMisses", true)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key == "Enter" && document.getElementById("start-time-input-el") == document.activeElement) {
            const temp = document.createElement("input");
            document.body.appendChild(temp);
            temp.focus();
            document.body.removeChild(temp);
        } 
    }
    const lastValidStartTime = useRef(settingsObj.musicStartTime)
    const selectedVideoRef = useRef(null)
    const handleUnFocus = () => {
        const currInput = document.getElementById("start-time-input-el").value.slice(0, -1)
        const minutes = parseInt(/^\d+[:]/.exec(selectedVideoRef.current.snippet.duration)[0].slice(0, -1))
        const seconds = parseInt(/[:]\d+$/.exec(selectedVideoRef.current.snippet.duration)[0].slice(1))
        const durationInSeconds = (minutes * 60 + seconds - 1)
        if (currInput.match(/^[0-9]+([.][0-9]*)?$/) && Number(currInput) <= durationInSeconds) {
            const inputRounded = parseFloat(Number(currInput).toFixed(2))
            updateSettingObj("musicStartTime", inputRounded)
            lastValidStartTime.current = inputRounded
            setMusicStartTime(inputRounded)
        } else if (currInput == "") {
            updateSettingObj("musicStartTime", 0)
            lastValidStartTime.current = 0
            setMusicStartTime(0)
        } else {
            setMusicStartTime(lastValidStartTime.current)
        }
    }
    const handleStartTimeChange = (e) => {
        const input = e.target.value.slice(0, -1)
        setMusicStartTime(input)
    }

    useEffect(() => {
        selectedVideoRef.current = selectedVideo
    }, [selectedVideo])

    const [showImageSelector, setShowImageSelector] = useState(!settingsObj.useVideoForBackground)
    const [useVideoForBackground, setUseVideoForBackground] = useState(settingsObj.useVideoForBackground)
    const handleGameBackgroundToggle = () => {
        if (useVideoForBackground) {
            setUseVideoForBackground(false)
            updateSettingObj("useVideoForBackground", false)
            setShowImageSelector(true)
        } else {
            setUseVideoForBackground(true)
            updateSettingObj("useVideoForBackground", true)
            setShowImageSelector(false)
        }
    }
    const imageSelectorRef = useRef(null)
    const handleNewImageUpload = () => {
        const reader = new FileReader() 
        const image = imageSelectorRef.current.files[0]
        reader.addEventListener("load", () => {
            localStorage.setItem("game-background", reader.result)
        })
        reader.readAsDataURL(image)
    }

    return (
        <div className="settings-list-wrapper" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
            {
                pauseMenu ? "" :
                <div className="settings-list-title">
                    <h3>Game Settings</h3>
                </div>
            }
            <div className="settings-list-content" style={{height: pauseMenu? "100%" : "77.1%", marginTop: pauseMenu ? "0" : "2vh", backgroundImage: pauseMenu ? "" : `url(${settingsBackground})`}}>
                {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Difficulty</h3>
                        <div className="settings-list-row-content">
                            <button className="word-button" onClick={handleDifficultyChange} style={{cursor: "pointer"}}>{difficulty}</button>
                        </div>
                    </div>
                }
                {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Note Speed</h3>
                        <div className="settings-list-row-content">
                            <StepperButton min={1.0} max={1.6} start={tileSpeed} step={0.1} round={1} setVal={setTileSpeed}></StepperButton>
                        </div>
                    </div>
                }
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>Note Theme</h3>
                    <div className="settings-list-row-content">
                        <button id="theme-button" onClick={handleThemeToggle} style={{backgroundImage: `url(${theme == "dark" ? darkTheme : lightTheme})`, cursor: "pointer"}}></button>
                    </div>
                </div>
                {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Game Background</h3>
                        <div className="settings-list-row-content">
                            <button className="word-button" onClick={handleGameBackgroundToggle} style={{cursor: "pointer"}}>{useVideoForBackground ? "Video" : "Image"}</button>
                        </div>
                    </div>
                }
                {
                    !pauseMenu && showImageSelector ?
                    <div className="settings-list-row">
                        <h3>Upload Custom Game Background</h3>
                        <div className="settings-list-row-content">
                            <input className="settings-list-image-selector" ref={imageSelectorRef} type="file" onInputCapture={handleNewImageUpload} accept=".jpg, jpeg, .png, .webp"></input>
                        </div>
                    </div> : 
                    ""
                }
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>UI Hue</h3>
                    <div className="settings-list-row-content">
                        <input className="hue-slider" type="range" min="346" max="705" defaultValue={settingsObj.uiHue} onChange={handleUiHueChange}></input>
                    </div>
                </div>
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>UI Saturation</h3>
                    <div className="settings-list-row-content">
                        <StepperButton min={0.0} max={4.0} start={uiSaturation} step={0.2} round={1} setVal={setUiSaturation}></StepperButton>
                    </div>
                </div>
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>UI Brightness</h3>
                    <div className="settings-list-row-content">
                        <StepperButton min={0.5} max={1.8} start={uiBrightness} step={0.05} round={2} setVal={setUiBrightness}></StepperButton>
                    </div>
                </div>
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>Video Saturation</h3>
                    <div className="settings-list-row-content">
                        <StepperButton min={0.0} max={4.0} start={videoSaturation} step={0.2} round={1} setVal={setVideoSaturation}></StepperButton>
                    </div>
                </div>
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>Video Brightness</h3>
                    <div className="settings-list-row-content">
                        <StepperButton min={0.3} max={1.5} start={videoBrightness} step={0.05} round={2} setVal={setVideoBrightness}></StepperButton>
                    </div>
                </div>
                {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Music Start Time (Default 0s)</h3>
                        <div className="settings-list-row-content-stacked">
                            <input className="settings-list-start-time" id="start-time-input-el" type="text" value={musicStartTime + "s"} 
                            onChange={handleStartTimeChange} autoComplete="off"></input>
                        </div>
                    </div>
                }
                {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Smooth Animations</h3>
                        <div className="settings-list-row-content">
                            <button className="word-button" onClick={handleSmoothAnimationsToggle} style={{cursor: "pointer"}}>{smoothAnimations ? "On" : "Off"}</button>
                        </div>
                    </div>
                }
                {/* {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Beat Notes</h3>
                        <div className="settings-list-row-content">
                            <button className="word-button" onClick={handleBeatNotesToggle} style={{cursor: "pointer"}}>{beatNotes ? "On" : "Off"}</button>
                        </div>
                    </div>
                } */}
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>Lower Volume On Misses</h3>
                    <div className="settings-list-row-content">
                        <button className="word-button" onClick={handleLowerVolumeOnMissesToggle} style={{cursor: "pointer"}}>{lowerVolumeOnMisses ? "On" : "Off"}</button>
                    </div>
                </div>
                <div className="settings-list-row">
                    <h3>Rainbow UI (Buggy)</h3>
                    <div className="settings-list-row-content">
                        <button className="word-button" onClick={handleRainbowUiToggle} style={{cursor: "pointer"}}>{rainbowUi ? "On" : "Off"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsList;