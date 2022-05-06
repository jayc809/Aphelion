import React, { useRef, useState, useEffect } from 'react'
import "./App.css"
import "./GameView.css"
import Platform from "./components/Platform"
import Video from "./components/Video"
import StartMessage from './components/StartMessage'
import Score from './components/Score'
import Combo from './components/Combo'
import TileGenerator from './components/TileGenerator'
const testVideoId = "IKKar5SS29E" 
const orangeVideoId = "3DrYQMK4hJE"
const blueVideoId = "IKKar5SS29E" 

const GameView = ({ setView, setResultsObjRef, beatmapObj }) => {

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
  const allPerfectRef = useRef(true)
  const onScoreMount = (score, setScore) => {
    scoreRef.current = score
    setScoreRef.current = setScore
  }
  const comboRef = useRef(null)
  const setComboRef = useRef(null)
  const highestComboRef = useRef(0)
  const totalComboRef = useRef(0)
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
      totalComboRef.current += 1
      if (comboRef.current > highestComboRef.current) {
        highestComboRef.current = comboRef.current
      }
      setComboRef.current(comboRef.current)
    }
    switch (accuracy) {
      case "perfect":  
        incrementScore(100)
        incrementCombo()
        break
      case "great":  
        allPerfectRef.current = false
        incrementScore(80)
        incrementCombo()
        break
      case "good":  
        allPerfectRef.current = false
        incrementScore(60)
        incrementCombo()
        break
      case "miss": 
        allPerfectRef.current = false
        comboRef.current = 0
        setComboRef.current(0)
        break
    }
    console.log("highest: " + highestComboRef.current)
    console.log("total: " + totalComboRef.current)
    console.log("all perfect: " + allPerfectRef.current)

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
  const beatNumberRef = useRef(null)
  const setBeatNumberRef= useRef(null)
  const onTileGeneratorMount = (beatNumber, setBeatNumber) => {
    beatNumberRef.current = beatNumber
    setBeatNumberRef.current = setBeatNumber
  }
  const currVideoTime = useRef(0)
  const getCurrVideoTime = () => {
    return currVideoTime.current
  }
  const updateBeatNumber = (currTime) => {
    currVideoTime.current = currTime
    if (currTime >= beatmapObj.beatTime[beatNumberRef.current + 1] - 2 * beatmapObj.refreshTolerance &&
        currTime <= beatmapObj.beatTime[beatNumberRef.current + 1] + beatmapObj.refreshTolerance) {
      beatNumberRef.current += 1
      if (beatNumberRef.current > beatmapObj.beatTime.length - 1) {
        console.log("exceeded beatTime length")
      }
      setBeatNumberRef.current(beatNumberRef.current)
    }
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
  const getResultsObj= () => {
    const maxCombo = beatmapObj.beatmap.length
    const highestCombo = highestComboRef.current
    const totalCombo = totalComboRef.current
    const score = scoreRef.current
    const fullCombo = totalCombo == beatmapObj.beatmap.length ? true : false
    const fullPerfect = allPerfectRef.current
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

  return (
    <div id="screen" ref={screenRef} style={{cursor: mouseMoved ? "default" : "none"}}>

      {/* <div className="component" id="test">
        <button onClick={() => handleGameEnd()}>end</button>
      </div> */}

      <div className="component" id="ending-black-screen" ref={endingBlackScreenRef}></div>

      <div className="component" id="start-message">
        <StartMessage getAllowStart={getAllowStart}/>
      </div>

      <div className="component" id="score">
        <Score onMount={onScoreMount}/>
      </div>

      <div className="component" id="combo">
        <Combo onMount={onComboMount}/>
      </div>

      <div className="component" id="tile-generator">
        <TileGenerator 
          beatmapObj={beatmapObj} 
          onMount={onTileGeneratorMount} 
          tileSpeed={tileSpeed} 
          updateScoreAndCombo={updateScoreAndCombo}
          getAllowStart={getAllowStart}
          getCurrVideoTime={getCurrVideoTime}
        />
      </div>

      <div className="component" id="platform"> 
        <Platform/>
      </div>

      {
        showVideo ? 
        <div className="component" id="video"> 
          <Video 
            videoId={testVideoId} 
            updateBeatNumber={updateBeatNumber} 
            beatmapObj={beatmapObj} 
            tileSpeed={tileSpeed}
            getAllowStart={getAllowStart}
            onAllowStart={handleAllowStart}
            onVideoEnd={handleGameEnd}
          />
        </div> :
        ""
      }

    </div>
  )
}

export default GameView;
