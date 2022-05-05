import './App.css'
import GameView from "./GameView"
import AnalyzerView from './AnalyzerView'
import TestView from "./TestView"
import { useRef, useState } from 'react'

function App() {

  const [view, setView] = useState("analyzer")
  const beatmapObjRef = useRef(null)

  const setBeatmapObjRef = (beatmapObj) => {
    beatmapObjRef.current = beatmapObj
  }

  return (
    <div id="app">
      {
        {
          "analyzer": <AnalyzerView setView={setView} setBeatmapObjRef={setBeatmapObjRef}/>,
          "game": <GameView setView={setView} beatmapObj={beatmapObjRef.current}/>
        } [view]
      }
      {/* <TestView/> */}
    </div>
  )
}

export default App