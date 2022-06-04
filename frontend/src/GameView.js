import React, { useRef, useState, useEffect } from 'react'
import "./App.css"
import "./GameView.css"
import Platform from "./GameViewComponents/Platform"
import Video from "./GameViewComponents/Video"
import StartMessage from './GameViewComponents/StartMessage'
import Score from './GameViewComponents/Score'
import Combo from './GameViewComponents/Combo'
import PerfectDisplay from "./GameViewComponents/PerfectDisplay"
import TileGenerator from './GameViewComponents/TileGenerator'
import PauseMenu from './GameViewComponents/PauseMenu'
import TransitionInView from './TransitionInView'
import TransitionOutView from "./TransitionOutView"
const testVideoId = "IKKar5SS29E" 
const orangeVideoId = "3DrYQMK4hJE"
const blueVideoId = "IKKar5SS29E" 

const GameView = ({ setView, incrementGameId, setResultsObjRef, settingsObj, setSettingsObj, beatmapObj }) => {

  // console.log("rerendered GameView")

  const [showGame, setShowGame] = useState(false)
  //initialization
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    setTimeout(() => {
      setShowGame(true)
    }, 700)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const [mouseMoved, setMouseMoved] = useState(false)
  const handleMouseMove = (e) => {
    setMouseMoved(true)
  }

  useEffect(() => {
    if (mouseMoved) {
      setTimeout(() => {
        setMouseMoved(false)
      }, 2000)
    }
  }, [mouseMoved])

  //update score and combo
  const scoreRef = useRef(null)
  const setScoreRef = useRef(null)
  const onScoreMount = (score, setScore) => {
    scoreRef.current = score
    setScoreRef.current = setScore
  }
  const comboRef = useRef(null)
  const setComboRef = useRef(null)
  const maxComboRef = useRef(0)
  const totalComboRef = useRef(0)
  const totalPerfectRef = useRef(0)
  const noMissesRef = useRef(null)
  const onComboMount = (combo, setCombo) => {
    comboRef.current = combo
    setComboRef.current = setCombo
  }
  const setPerfectDisplayRef = useRef(null)
  const onPerfectDisplayMount = (setPerfectDisplay) => {
    setPerfectDisplayRef.current = setPerfectDisplay
  }

  const updateScoreAndCombo = (accuracy) => {
    const incrementScore = (amount) => {
      scoreRef.current += amount
      setScoreRef.current(scoreRef.current)
    }
    const incrementCombo = () => {
      comboRef.current += 1
      totalComboRef.current += 1
      maxComboRef.current = Math.max(comboRef.current, maxComboRef.current)
      setComboRef.current(comboRef.current)
    }
    switch (accuracy) {
      case "perfect":  
        incrementScore(parseInt(10000 * (1 + comboRef.current / 100)))
        incrementCombo()
        totalPerfectRef.current += 1
        setPerfectDisplayRef.current(true)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("high")
        }
        if (noMissesRef.current == null) {
          noMissesRef.current = true
        }
        break
      case "great":  
        incrementScore(parseInt(8000 * (1 + comboRef.current / 100)))
        incrementCombo()
        setPerfectDisplayRef.current(false)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("high")
        }
        if (noMissesRef.current == null) {
          noMissesRef.current = true
        }
        break
      case "good":  
        incrementScore(parseInt(6000 * (1 + comboRef.current / 100)))
        incrementCombo()
        setPerfectDisplayRef.current(false)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("high")
        }
        if (noMissesRef.current == null) {
          noMissesRef.current = true
        }
        break
      case "miss": 
        noMissesRef.current = false
        comboRef.current = 0
        setComboRef.current(0)
        setPerfectDisplayRef.current(false)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("low")
        }
        break
    }
  }


  //control tile generator
  const tileSpeed = 1.3
  const handleTimeChangeRef = useRef(null)
  const pauseTilesRef = useRef(null)
  const playTilesRef = useRef(null)
  const disableKeyboardRef = useRef(null)
  const onTileGeneratorMount = (handleTimeChange, pauseTiles, playTiles, disableKeyboard) => {
    handleTimeChangeRef.current = handleTimeChange
    pauseTilesRef.current = pauseTiles
    playTilesRef.current = playTiles
    disableKeyboardRef.current = disableKeyboard
  }
  const updateCurrTime = (currTime) => {
    handleTimeChangeRef.current(currTime)
  }

  const allowStart = useRef(false)
  const handleAllowStart = () => {
    allowStart.current = true
  }
  const getAllowStart = () => {
    return allowStart.current
  }

  const endingBlackScreenRef = useRef(null)
  const [showVideo, setShowVideo] = useState(true)
  const getResultsObj = () => {
    const totalNotes = beatmapObj.maxCombo
    const totalCombo = totalComboRef.current
    const totalPerfect = totalPerfectRef.current
    const noMisses = noMissesRef.current == true ? true : false
    const fullCombo = totalCombo == totalNotes
    const fullPerfect = totalPerfect == totalNotes
    let tier = null
    if (fullCombo || fullPerfect) {
      tier = "S"
    } else if (totalCombo / totalNotes > 0.95 && noMisses) {
      tier = "S"
    } else if (totalCombo / totalNotes > 0.95) {
      tier = "A"
    } else if (totalCombo / totalNotes > 0.9) {
      tier = "B"
    } else if (totalCombo / totalNotes > 0.85) {
      tier = "C"
    } else if (totalCombo / totalNotes > 0.8) {
      tier = "D"
    } else {
      tier = "F"
    }
    return {
      totalNotes: totalNotes,
      maxCombo: maxComboRef.current,
      totalCombo: totalCombo,
      totalPerfect: totalPerfect,
      score: scoreRef.current,
      noMisses: noMisses,
      fullCombo: fullCombo,
      fullPerfect: fullPerfect,
      tier: tier
    }
  }

  const setAudioPlayRef = useRef(null)
  const setVideoPlayRef = useRef(null)
  const setVideoVolumeRef = useRef(null)
  const blackScreenPresent = useRef(true)
  const onVideoMount = (setAudioPlay, setVideoPlay, setVideoVolume) => {
    setAudioPlayRef.current = setAudioPlay
    setVideoPlayRef.current = setVideoPlay
    setVideoVolumeRef.current = setVideoVolume
  }

  const pauseGame = (pause) => {
    if (!blackScreenPresent.current) {     
      if (pause) {
        if (setAudioPlayRef.current != null && setVideoPlayRef.current != null) {
          setAudioPlayRef.current(false)
          setVideoPlayRef.current(false)
          pauseTilesRef.current()
          disableKeyboardRef.current(true)
        }
      } else {
        if (setAudioPlayRef.current != null && setVideoPlayRef.current != null) {
          setAudioPlayRef.current(true)
          setVideoPlayRef.current(true)
          playTilesRef.current()
          disableKeyboardRef.current(false)
        }
      }
    }
  }

  const [transitionOut, setTransitionOut] = useState(false)

  const restartGame = () => {
    nextViewDestinationRef.current = "game"
    setTransitionOut(true)
  }
  const nextViewDestinationRef = useRef("")
  const nextViewGame = () => {
    incrementGameId()
  }
 
  const endGame = (delay) => {
    // endingBlackScreenRef.current.style.animation = "fade-in 2s forwards"
    const resultsObj = getResultsObj()
    setResultsObjRef(resultsObj)
    setShowVideo(false)
    if (delay == "delay") {
      setTimeout(() => {
        nextViewDestinationRef.current = "results"
        setTransitionOut(true)
      }, 2000)
    } else {
      setShowVideo(false)
      nextViewDestinationRef.current = "results"
      setTransitionOut(true)
    }
  }
  const nextViewResults = () => {
    setView("results")
  }


  return (
    <div className="screen-wrapper">
      <TransitionInView delay={1} settingsObj={settingsObj}></TransitionInView>
      <TransitionOutView 
        nextView={
          nextViewDestinationRef.current == "game" ? nextViewGame : nextViewResults
        } 
        start={transitionOut} settingsObj={settingsObj}></TransitionOutView>
      <div className="game-view-wrapper" style={{ cursor: mouseMoved ? "default" : "none", opacity: showGame ? 1 : 0}}>

        <div className="component" id="ending-black-screen" ref={endingBlackScreenRef}></div>
        
        <div className="component" id="pause-menu">
          <PauseMenu pauseGame={pauseGame} restartGame={restartGame} endGame={endGame} settingsObj={settingsObj} setSettingsObj={setSettingsObj}/>
        </div>

        <div className="component" id="start-message">
          <StartMessage getAllowStart={getAllowStart}/>
        </div>

        <div className="component" id="score">
          <Score onMount={onScoreMount}/>
        </div>

        <div className="component" id="combo">
          <Combo onMount={onComboMount}/>
        </div>
        <div className="component" id="perfect-display">
          <PerfectDisplay onMount={onPerfectDisplayMount}></PerfectDisplay>
        </div>

        <div className="component" id="tile-generator" style={{filter: `hue-rotate(${settingsObj.uiHue}deg) saturate(${settingsObj.uiSaturation}) brightness(${settingsObj.uiBrightness})`}}>
          <TileGenerator 
            beatmapObj={beatmapObj} 
            onMount={onTileGeneratorMount} 
            tileSpeed={tileSpeed} 
            updateScoreAndCombo={updateScoreAndCombo}
            getAllowStart={getAllowStart}
          />
        </div>

        <div className="component" id="platform"> 
          <Platform/>
        </div>

        {
          showVideo ? 
          <div className="component" id="video" style={{filter: `saturate(${settingsObj.videoSaturation}) brightness(${settingsObj.videoBrightness})`}}> 
            <Video 
              updateCurrTime={updateCurrTime} 
              beatmapObj={beatmapObj} 
              tileSpeed={tileSpeed}
              getAllowStart={getAllowStart}
              onAllowStart={handleAllowStart}
              onVideoEnd={endGame}
              onMount={onVideoMount}
              blackScreenPresent={blackScreenPresent}
            />
          </div> :
          ""
        }

      </div>
    </div>
  )
}

export default GameView;
