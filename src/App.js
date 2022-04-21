import React, { useRef, useState } from 'react'
import "./App.css"
import Tile from "./components/Tile"
import Platform from "./components/Platform"
import Video from "./components/Video"
import StartMessage from './components/StartMessage'
import Score from './components/Score'
import Combo from './components/Combo'
import { useEffect } from "react"
const testVideoId = "3DrYQMK4hJE"
const orangeVideoId = "3DrYQMK4hJE"
const blueVideoId = "IKKar5SS29E" 

function App() {

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

  useEffect(() => {
    handleScreenResize()
    window.addEventListener("resize", handleScreenResize)
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("resize", handleScreenResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  })

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


      
      <div className="component" id="tile">
        <Tile type="left" updateScore={updateScore}/>
      </div>

      {/* <div className="component" id="tile">
        <Tile type="middleLeft"/>
      </div>

      <div className="component" id="tile">
        <Tile type="middleRight"/>
      </div>

      <div className="component" id="tile">
        <Tile type="right"/>
      </div>  */}



      <div className="component" id="platform"> 
        <Platform/> 
      </div>

      <div className="component" id="video"> 
        <Video videoId={testVideoId}/>
      </div>

    </div>
  )
}

export default App;
