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

const GameView = ({ setView, incrementGameId, setResultsObjRef, settingsObj, beatmapObj }) => {

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

  //update score and combo
  const scoreRef = useRef(null)
  const setScoreRef = useRef(null)
  const fullPerfectRef = useRef(true)
  const onScoreMount = (score, setScore) => {
    scoreRef.current = score
    setScoreRef.current = setScore
  }
  const comboRef = useRef(null)
  const setComboRef = useRef(null)
  const highestComboRef = useRef(0)
  const totalComboRef = useRef(0)
  const fullComboRef = useRef(true)
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
      if (comboRef.current > highestComboRef.current) {
        highestComboRef.current = comboRef.current
      }
      setComboRef.current(comboRef.current)
    }
    switch (accuracy) {
      case "perfect":  
        incrementScore(parseInt(100 * (1 + comboRef.current / 100)))
        incrementCombo()
        setPerfectDisplayRef.current(true)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("high")
        }
        break
      case "great":  
        fullPerfectRef.current = false
        incrementScore(parseInt(80 * (1 + comboRef.current / 100)))
        incrementCombo()
        setPerfectDisplayRef.current(false)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("high")
        }
        break
      case "good":  
        fullPerfectRef.current = false
        incrementScore(parseInt(60 * (1 + comboRef.current / 100)))
        incrementCombo()
        setPerfectDisplayRef.current(false)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("high")
        }
        break
      case "miss": 
        fullPerfectRef.current = false
        fullComboRef.current = false
        comboRef.current = 0
        setComboRef.current(0)
        setPerfectDisplayRef.current(false)
        if (settingsObj.lowerVolumeOnMisses) {
          setVideoVolumeRef.current("low")
        }
        break
    }
  }

  const [mouseMoved, setMouseMoved] = useState(false)
  const handleMouseMove = (e) => {
    setMouseMoved(true)
  }
  useEffect(() => {
    const mouseTimer = setTimeout(() => {
      setMouseMoved(false)
    }, 2000)
    return () => clearTimeout(mouseTimer)
  }, [handleMouseMove])


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
    const maxCombo = beatmapObj.maxCombo
    const highestCombo = highestComboRef.current
    const totalCombo = totalComboRef.current
    const score = scoreRef.current
    const fullCombo = fullComboRef.current
    const fullPerfect = fullPerfectRef.current
    let tier = null
    if (fullCombo || fullPerfect) {
      tier = "S"
    } else if (totalCombo / maxCombo > 0.95) {
      tier = "A"
    } else if (totalCombo / maxCombo > 0.9) {
      tier = "B"
    } else if (totalCombo / maxCombo > 0.85) {
      tier = "C"
    } else if (totalCombo / maxCombo > 0.8) {
      tier = "D"
    } else {
      tier = "F"
    }
    return {
      maxCombo: maxCombo,
      highestCombo: highestCombo,
      totalCombo: totalCombo,
      score: score,
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
    if (delay == "delay") {
      setTimeout(() => {
        setShowVideo(false)
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
      <div className="game-view-wrapper" style={{cursor: mouseMoved ? "default" : "none", opacity: showGame ? 1 : 0}}>

        <div className="component" id="ending-black-screen" ref={endingBlackScreenRef}></div>
        
        <div className="component" id="pause-menu">
          <PauseMenu pauseGame={pauseGame} restartGame={restartGame} endGame={endGame}/>
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
