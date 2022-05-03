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

  console.log("rerendered GameView")

  const nextScore = useRef(0)
  const [currScore, setCurrScore] = useState(0)
  const [currCombo, setCurrCombo] = useState(0)

  const updateScore = (accuracy) => {
    switch (accuracy) {
      case "perfect":  
        nextScore.current += 100
        setCurrCombo(currCombo + 1)
        break
      case "great":  
        nextScore.current += 80
        setCurrCombo(currCombo + 1)
        break
      case "good":  
        nextScore.current += 60
        setCurrCombo(currCombo + 1)
        break
      case "miss":  
        setCurrCombo(0)
        break
    }
  }

  useEffect(() => {
    const incrementer = setInterval(() => {
      if (nextScore.current > currScore) {
        setCurrScore(currScore + parseInt((nextScore.current - currScore) / 7) + 1)
      } else {
        setCurrScore(nextScore.current)
      }
    }, 50)
    return () => {
      clearInterval(incrementer)
    }
  }, [updateScore])

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

  let beatmapIndexLocal = null
  let setBeatmapIndexLocal= null
  const onTileGeneratorMount = (beatmapIndex, setBeatmapIndex) => {
    beatmapIndexLocal = beatmapIndex
    setBeatmapIndexLocal = setBeatmapIndex
  }

  const updateProgress = (player) => {
    // console.log(player.getCurrentTime())
    beatmapIndexLocal += 1
    if (beatmapIndexLocal > beatmap.current.length - 1) {
      beatmapIndexLocal = 0
    }
    setBeatmapIndexLocal(beatmapIndexLocal)
  }

  useEffect(() => {
    handleScreenResize()
    window.addEventListener("resize", handleScreenResize)
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("resize", handleScreenResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  })

  const bpm = useRef(182)
  const beatmap = useRef([1, 2, 3, 4, 1, 3, 2, 4, 2, 3, 4, 1, 2, 3, 4, 3, 1 ,3, 4, 4])

  return (
    <div id="screen" ref={screenRef} style={{cursor: mouseMoved ? "default" : "none"}}>

      <div className="component" id="start-message">
        <StartMessage/>
      </div>

      <div className="component" id="score">
        <Score score={currScore}/>
      </div>

      <div className="component" id="combo">
        <Combo combo={currCombo}/>
      </div>

      <div className="component" id="tile-generator">
        <TileGenerator beatmap={beatmap} onMount={onTileGeneratorMount} updateScore={updateScore}/>
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
