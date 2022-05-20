import './App.css'
import GameView from "./GameView"
import AnalyzerView from './AnalyzerView'
import ResultsView from './ResultsView'
import VideoInfoView from './VideoInfoView'
import TestView from "./TestView"
import { useRef, useState } from 'react'

function App() {

  const [view, setView] = useState("analyzer")
  const [gameId, setGameId] = useState(0)
  const beatmapObjRef = useRef(null)
  const resultsObjRef = useRef(null)

  const setBeatmapObjRef = (beatmapObj) => {
    beatmapObjRef.current = beatmapObj
  }

  const incrementGameId = () => {
    setGameId(gameId + 1)
  }

  const setResultsObjRef = (resultsObj) => {
    resultsObjRef.current = resultsObj
  }

  return (
    <div id="app">
      {
        {
          "videoinfo": <VideoInfoView/>,
          "analyzer": <AnalyzerView setView={setView} setBeatmapObjRef={setBeatmapObjRef}/>,
          "game": <GameView setView={setView} incrementGameId={incrementGameId} setResultsObjRef={setResultsObjRef} beatmapObj={beatmapObjRef.current} key={gameId}/>,
          "results": <ResultsView resultsObj={resultsObjRef.current}/>
        } [view]
      }
      {/* <TestView/> */}
    </div>
  )
}

export default App