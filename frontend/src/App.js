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
  const videoInfoRef = useRef({
    "id": {
      "kind": "youtube#video",
      "videoId": "IKKar5SS29E"
    },
    "snippet": {
      "publishedAt": "2021-04-13T13:30:17Z",
      "channelId": "UC5CwaMl1eIgY8h02uZw7u8A",
      "title": "GHOST / 星街すいせい(official)",
      "description": "「GHOST」 作詞：星街すいせい 作曲：佐藤厚仁(Dream Monster) 編曲：佐藤厚仁(Dream Monster) Electric Guitar,Acoustic ...",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/IKKar5SS29E/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/IKKar5SS29E/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/IKKar5SS29E/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Suisei Channel",
      "liveBroadcastContent": "none",
      "publishTime": "2018-11-22T11:00:00Z",
      "duration": "4:42"
    }
  })
  const [settingsObj, setSettingsObj] = useState({
      difficulty: "Hard",
      tileSpeed: 1.3,
      theme: "dark",
      uiHue: 342,
      uiSaturation: 1.6,
      uiBrightness: 1.0,
      videoSaturation: 2.0,
      videoBrightness: 0.8,
      smoothAnimations: true,
      beatNotes: true,
      lowerVolumeOnMisses: false
  })
  const beatmapObjRef = useRef(null)
  const resultsObjRef = useRef({
    maxCombo: 500,
    highestCombo: 320,
    totalCombo: 460,
    score: 589329,
    fullCombo: false,
    fullPerfect: false,
    tier: "A"
  })

  const setBeatmapObjRef = (beatmapObj) => {
    beatmapObjRef.current = beatmapObj
  }

  const incrementGameId = () => {
    setGameId(gameId + 1)
  }

  const setVideoInfoRef = (videoInfo) => {
    videoInfoRef.current = videoInfo
  }

  const setResultsObjRef = (resultsObj) => {
    resultsObjRef.current = resultsObj
  }

  return (
    <div id="app">
      {
        {
          "videos": <VideoSelectorView setView={setView} setVideoInfoRef={setVideoInfoRef} settingsObj={settingsObj} setSettingsObj={setSettingsObj}/>,
          "analyzer": <AnalyzerView setView={setView} setBeatmapObjRef={setBeatmapObjRef} settingsObj={settingsObj} videoId={videoInfoRef.current.id.videoId}/>,
          "game": <GameView setView={setView} incrementGameId={incrementGameId} setResultsObjRef={setResultsObjRef} settingsObj={settingsObj} beatmapObj={beatmapObjRef.current} key={gameId}/>,
          "results": <ResultsView setView={setView} incrementGameId={incrementGameId} resultsObj={resultsObjRef.current} settingsObj={settingsObj} videoInfo={videoInfoRef.current}/>
        } [view]
      }
      {/* <TestView/> */}
    </div>
  )
}

export default App