import React, { useRef, useState, useEffect } from 'react'
import "./App.css"
import Platform from "./components/Platform"
import Video from "./components/Video"
import StartMessage from './components/StartMessage'
import Score from './components/Score'
import Combo from './components/Combo'
import TileGenerator from './components/TileGenerator'
const testVideoId = "IKKar5SS29E" 
const orangeVideoId = "3DrYQMK4hJE"
const blueVideoId = "IKKar5SS29E" 

function GameView() {

  // console.log("rerendered GameView")

  //initialize
  useEffect(() => {
    handleScreenResize()
    window.addEventListener("resize", handleScreenResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("resize", handleScreenResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }
  }, [])

  //score and combo
  const scoreRef = useRef(null)
  const setScoreRef = useRef(null)
  const onScoreMount = (score, setScore) => {
    scoreRef.current = score
    setScoreRef.current = setScore
  }
  const comboRef = useRef(null)
  const setComboRef = useRef(null)
  const onComboMount = (combo, setCombo) => {
    comboRef.current = combo
    setComboRef.current = setCombo
  }
  const updateScoreAndCombo = (accuracy) => {
    const incrementScore = (amount) => {
      scoreRef.current += amount
      setScoreRef.current(scoreRef.current)
    }
    const incrementCombo = () => {
      comboRef.current += 1
      setComboRef.current(comboRef.current)
    }
    switch (accuracy) {
      case "perfect":  
        incrementScore(100)
        incrementCombo()
        break
      case "great":  
        incrementScore(80)
        incrementCombo()
        break
      case "good":  
        incrementScore(60)
        incrementCombo()
        break
      case "miss":  
        setComboRef.current(0)
        break
    }
  }

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

  const beatmapIndexRef = useRef(null)
  const setBeatmapIndexRef= useRef(null)
  const onTileGeneratorMount = (beatmapIndex, setBeatmapIndex) => {
    beatmapIndexRef.current = beatmapIndex
    setBeatmapIndexRef.current = setBeatmapIndex
  }

  const updateProgress = (player) => {
    // console.log(player.getCurrentTime())
    beatmapIndexRef.current += 1
    if (beatmapIndexRef.current > beatmap.current.length - 1) {
      beatmapIndexRef.current = 0
    }
    setBeatmapIndexRef.current(beatmapIndexRef.current)
  }

  const handleMouseUp = () => {
    updateScoreAndCombo("good")
  }

  const bpm = useRef(182)
  const beatmap = useRef([1, 2, 3, 4, 1, 3, 2, 4, 2, 3, 4, 1, 2, 3, 4, 3, 1 ,3, 4, 4])

  return (
    <div id="screen" ref={screenRef} style={{cursor: mouseMoved ? "default" : "none"}}>

      <div className="component" id="start-message">
        <StartMessage/>
      </div>

      <div className="component" id="score">
        <Score onMount={onScoreMount}/>
      </div>

      <div className="component" id="combo">
        <Combo onMount={onComboMount}/>
      </div>

      <div className="component" id="tile-generator">
        <TileGenerator beatmap={beatmap} onMount={onTileGeneratorMount}/>
      </div>

      <div className="component" id="platform"> 
        <Platform/> 
      </div>

      <div className="component" id="video"> 
        <Video videoId={testVideoId} updateProgress={updateProgress} bpm={bpm}/>
      </div>

    </div>
  )
}

export default GameView;
