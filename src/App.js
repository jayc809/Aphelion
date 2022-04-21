import React, { useRef, useState } from 'react'
import "./App.css"
import Tile from "./components/Tile"
import Platform from "./components/Platform"
import Video from "./components/Video"
import StartMessage from './components/StartMessage'
import Score from './components/Score'
import TileTest from "./components/TileTest"
import { useEffect } from "react"
const testVideoId = "3DrYQMK4hJE"
const orangeVideoId = "3DrYQMK4hJE"
const blueVideoId = "IKKar5SS29E" 

function App() {

  const [showStartMessage, setShowStartMessage] = useState(true)
  const nextScore = useRef(0)
  const [currScore, setCurrScore] = useState(0)

  const updateScores = () => {
    nextScore.current += 100
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
  }, [updateScores])

  const handleDown = (key) => {
    setShowStartMessage(false)
    updateScores()
  }
  const handleUp = (key) => {
  }

  const screenRef = useRef(null)
  const handleScreenResize = () => {
    const screen = screenRef.current
    screen.style.width = (window.innerWidth) + "px"
    screen.style.height = (window.innerHeight) + "px"
  }

  useEffect(() => {
    handleScreenResize()
    window.addEventListener("resize", handleScreenResize)
    return () => {
      window.removeEventListener("resize", handleScreenResize)
    }
  }, [])

  return (
    <div id="screen" ref={screenRef}>

      <div className="component" id="start-message">
        <StartMessage showStartMessage={showStartMessage}/>
      </div>

      <div className="component" id="score">
        <Score score={currScore}/>
      </div>
      

      
      <div className="component" id="tile">
        <Tile type="left"/>
      </div>

      <div className="component" id="tile">
        <Tile type="middleLeft"/>
      </div>

      <div className="component" id="tile">
        <Tile type="middleRight"/>
      </div>

      <div className="component" id="tile">
        <Tile type="right"/>
      </div> 



      <div className="component" id="platform"> 
        <Platform handleDown={handleDown} handleUp={handleUp}/> 
      </div>

      <div className="component" id="video"> 
        <Video videoId={testVideoId}/>
      </div>

    </div>
  )
}

export default App;
