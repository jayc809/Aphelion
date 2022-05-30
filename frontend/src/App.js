import './App.css'
import GameView from "./GameView"
import AnalyzerView from './AnalyzerView'
import ResultsView from './ResultsView'
import VideoSelectorView from './VideoSelectorView'
import TestView from "./TestView"
import { useRef, useState } from 'react'

function App() {

  const [view, setView] = useState("videos")
  const [gameId, setGameId] = useState(0)
  const videoIdRef = useRef("IKKar5SS29E")
  const [settingsObj, setSettingsObj] = useState({
      difficulty: "Hard",
      tileSpeed: 1.3,
      theme: "dark",
      uiHue: 0,
      uiSaturation: 1.6,
      uiBrightness: 1.0,
      videoSaturation: 2.0,
      videoBrightness: 0.8,
      smoothAnimations: true,
      beatNotes: true,
      lowerVolumeOnMisses: false
  })
  const beatmapObjRef = useRef(null)
  const resultsObjRef = useRef(null)

  const setBeatmapObjRef = (beatmapObj) => {
    beatmapObjRef.current = beatmapObj
  }

  const incrementGameId = () => {
    setGameId(gameId + 1)
  }

  const setVideoIdRef = (videoId) => {
    videoIdRef.current = videoId
  }

  const setResultsObjRef = (resultsObj) => {
    resultsObjRef.current = resultsObj
  }

  return (
    <div id="app">
      {
        {
          "videos": <VideoSelectorView setView={setView} setVideoIdRef={setVideoIdRef} settingsObj={settingsObj} setSettingsObj={setSettingsObj}/>,
          "analyzer": <AnalyzerView setView={setView} setBeatmapObjRef={setBeatmapObjRef} settingsObj={settingsObj} videoId={videoIdRef.current}/>,
          "game": <GameView setView={setView} incrementGameId={incrementGameId} setResultsObjRef={setResultsObjRef} settingsObj={settingsObj} beatmapObj={beatmapObjRef.current} key={gameId}/>,
          "results": <ResultsView resultsObj={resultsObjRef.current}/>
        } [view]
      }
      {/* <TestView/> */}
    </div>
  )
}

export default App