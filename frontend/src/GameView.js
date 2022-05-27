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
const testVideoId = "IKKar5SS29E" 
const orangeVideoId = "3DrYQMK4hJE"
const blueVideoId = "IKKar5SS29E" 

const GameView = ({ setView, incrementGameId, setResultsObjRef, beatmapObj }) => {

  // console.log("rerendered GameView")

  //initialization
  useEffect(() => {
    handleScreenResize()
    window.addEventListener("resize", handleScreenResize)
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("resize", handleScreenResize)
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
        break
      case "great":  
        fullPerfectRef.current = false
        incrementScore(parseInt(80 * (1 + comboRef.current / 100)))
        incrementCombo()
        setPerfectDisplayRef.current(false)
        break
      case "good":  
        fullPerfectRef.current = false
        incrementScore(parseInt(60 * (1 + comboRef.current / 100)))
        incrementCombo()
        setPerfectDisplayRef.current(false)
        break
      case "miss": 
        fullPerfectRef.current = false
        fullComboRef.current = false
        comboRef.current = 0
        setComboRef.current(0)
        setPerfectDisplayRef.current(false)
        break
    }
  }

  //resize window and hide crusor
  const screenRef = useRef(null)
  const handleScreenResize = () => {
    const screen = screenRef.current
    screen.style.width = (window.innerWidth) + "px"
    screen.style.height = (window.innerHeight) + "px"
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
  const onTileGeneratorMount = (handleTimeChange, pauseTiles, playTiles) => {
    handleTimeChangeRef.current = handleTimeChange
    pauseTilesRef.current = pauseTiles
    playTilesRef.current = playTiles
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
  const handleGameEnd = () => {
    setShowVideo(false)
    const resultsObj = getResultsObj()
    setResultsObjRef(resultsObj)
    endingBlackScreenRef.current.style.animation = "fade-in 2s forwards"
    setTimeout(() => {
      setView("results")
    }, 2000)
  }

  const setAudioPlayRef = useRef(null)
  const setVideoPlayRef = useRef(null)
  const blackScreenPresent = useRef(true)
  const onVideoMount = (setAudioPlay, setVideoPlay) => {
    setAudioPlayRef.current = setAudioPlay
    setVideoPlayRef.current = setVideoPlay
  }

  const pauseGame = (pause) => {
    if (!blackScreenPresent.current) {     
      if (pause) {
        if (setAudioPlayRef.current != null && setVideoPlayRef.current != null) {
          console.log("game paused")
          setAudioPlayRef.current(false)
          setVideoPlayRef.current(false)
          pauseTilesRef.current()
        }
      } else {
        if (setAudioPlayRef.current != null && setVideoPlayRef.current != null) {
          console.log("game playing")
          setAudioPlayRef.current(true)
          setVideoPlayRef.current(true)
          playTilesRef.current()
        }
      }
    }
  }

  const restartGame = () => {
    console.log("game restarted")
    incrementGameId()
  }

  return (
    <div id="screen" ref={screenRef} style={{cursor: mouseMoved ? "default" : "none"}}>

      {/* <div className="component" id="test">
        <button onClick={() => handleGameEnd()}>end</button>
      </div> */}

      <div className="component" id="ending-black-screen" ref={endingBlackScreenRef}></div>
      
      <div className="component" id="pause-menu">
        <PauseMenu pauseGame={pauseGame} restartGame={restartGame}/>
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

      <div className="component" id="tile-generator">
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
        <div className="component" id="video"> 
          <Video 
            updateCurrTime={updateCurrTime} 
            beatmapObj={beatmapObj} 
            tileSpeed={tileSpeed}
            getAllowStart={getAllowStart}
            onAllowStart={handleAllowStart}
            onVideoEnd={handleGameEnd}
            onMount={onVideoMount}
            blackScreenPresent={blackScreenPresent}
          />
        </div> :
        ""
      }

    </div>
  )
}

export default GameView;
