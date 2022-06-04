import React, { useEffect, useState } from 'react';
import "../styles/SettingsList.css"
import StepperButton from './StepperButton';
import darkTheme from "../images/tile.png"
import lightTheme from "../images/tile-light.png"
import settingsBackground from "../images/test-bg.png"

const SettingsList = ({ settingsObj, setSettingsObj, pauseMenu=false }) => {

    const [difficulty, setDifficulty] = useState(settingsObj.difficulty)
    const [tileSpeed, setTileSpeed] = useState(settingsObj.tileSpeed)
    const [theme, setTheme] = useState(settingsObj.theme)
    const [uiSaturation, setUiSaturation] = useState(settingsObj.uiSaturation)
    const [uiBrightness, setUiBrightness] = useState(settingsObj.uiBrightness)
    const [videoSaturation, setVideoSaturation] = useState(settingsObj.videoSaturation)
    const [videoBrightness, setVideoBrightness] = useState(settingsObj.videoBrightness)
    const [smoothAnimations, setSmoothAnimations] = useState(settingsObj.smoothAnimations)
    const [beatNotes, setBeatNotes] = useState(settingsObj.beatNotes)
    const [lowerVolumeOnMisses, setLowerVolumeOnMisses] = useState(settingsObj.lowerVolumeOnMisses)

    const updateSettingObj = (name, val) => {
        const settingsObjCopy = JSON.parse(JSON.stringify(settingsObj))
        settingsObjCopy[name] = val
        setSettingsObj(settingsObjCopy)
    }

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

    const handleBeatNotesToggle = () => {
        if (beatNotes) {
            setBeatNotes(false)
            updateSettingObj("beatNotes", false)
        } else {
            setBeatNotes(true)
            updateSettingObj("beatNotes", true)
        }
    }

    const handleLowerVolumeOnMissesToggle = () => {
        if (lowerVolumeOnMisses) {
            setLowerVolumeOnMisses(false)
            updateSettingObj("lowerVolumeOnMisses", false)
        } else {
            setLowerVolumeOnMisses(true)
            updateSettingObj("lowerVolumeOnMisses", true)
        }
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
                            <button className="word-button" onClick={handleDifficultyChange}>{difficulty}</button>
                        </div>
                    </div>
                }
                {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Note Speed</h3>
                        <div className="settings-list-row-content">
                            <StepperButton min={0.7} max={1.8} start={tileSpeed} step={0.1} round={1} setVal={setTileSpeed}></StepperButton>
                        </div>
                    </div>
                }
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>Theme</h3>
                    <div className="settings-list-row-content">
                        <button id="theme-button" onClick={handleThemeToggle} style={{backgroundImage: `url(${theme == "dark" ? darkTheme : lightTheme})`}}></button>
                    </div>
                </div>
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>UI Hue</h3>
                    <div className="settings-list-row-content">
                        <input className="hue-slider" type="range" min="0" max="359" defaultValue={settingsObj.uiHue} onChange={handleUiHueChange}></input>
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
                        <h3>Smooth Animations</h3>
                        <div className="settings-list-row-content">
                            <button className="word-button" onClick={handleSmoothAnimationsToggle}>{smoothAnimations ? "On" : "Off"}</button>
                        </div>
                    </div>
                }
                {
                    pauseMenu ? "" :
                    <div className="settings-list-row">
                        <h3>Beat Notes</h3>
                        <div className="settings-list-row-content">
                            <button className="word-button" onClick={handleBeatNotesToggle}>{beatNotes ? "On" : "Off"}</button>
                        </div>
                    </div>
                }
                <div className="settings-list-row" style={{height: pauseMenu ? "20%" : "15%"}}>
                    <h3>Lower Volume On Misses</h3>
                    <div className="settings-list-row-content">
                        <button className="word-button" onClick={handleLowerVolumeOnMissesToggle}>{lowerVolumeOnMisses ? "On" : "Off"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsList;