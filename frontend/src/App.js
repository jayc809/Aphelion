import './App.css'
import GameView from "./GameView"
import AnalyzerView from './AnalyzerView'
import ResultsView from './ResultsView'
import VideoSelectorView from './VideoSelectorView'
import CheckDimensionView from './utilComponents/CheckDimensionView'
import CheckBrowserView from './utilComponents/CheckBrowserView'
import TestView from "./utilComponents/TestView"
import MainView from './MainView'
import { useEffect, useRef, useState } from 'react'
import AnimationView from './utilComponents/AnimationView'

function App() {

  const [view, setView] = useState("main")
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
      difficulty: "Medium",
      tileSpeed: 1.3,
      theme: "dark",
      useVideoForBackground: true,
      uiHue: 346,
      uiSaturation: 1.6,
      uiBrightness: 1.0,
      rainbowUi: false,
      videoSaturation: 2.0,
      videoBrightness: 0.85,
      musicStartTime: 0.0,
      smoothAnimations: true,
      beatNotes: true,
      lowerVolumeOnMisses: false
  })
  const beatmapObjRef = useRef(null)
  const resultsObjRef = useRef({
    totalNotes: 500,
    maxCombo: 470,
    totalCombo: 470,
    totalPerfect: 482,
    score: 589329,
    noMisses: true,
    fullCombo: false,
    fullPerfect: false,
    tier: "A"
  })
  const showMainViewTransitionInRef = useRef(false)

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

  const setShowMainViewTransitionInRef = (tf) => {
    showMainViewTransitionInRef.current = tf
  }

  const [isDownloadingImages, setIsDownloadingImages] = useState(true)
  const dirToArray = (dirName, start, end) => {
    const arr = []
    for (let i = start; i < end; i += 1) {
      arr.push(`./animations/${dirName}/${dirName}-${String(i).padStart(2, "0")}.png`)
    }
    return arr
  }
  const cacheImages = async (imageSrcs) => {
    for (let i = 0; i < 30; i += 1) {
      const img = new Image()
      img.src = require( `./animations/tap-perfect/tap-perfect-${String(i).padStart(2, "0")}.png`)
      // img.src = require(imageSrcs[i])
    }
    // const promises = await imageSrcs.map((src) => {
    //   return new Promise((resolve, reject) => {
    //     console.log("yee")
    //     const img = new Image()
    //     img.src = require(src)
    //     img.onload = resolve()
    //     img.onerror = reject()
    //   })
    // })

    // await Promise.all(promises)
    setTimeout(() => {  
      setIsDownloadingImages(false)
    }, 5000);
  }
  useEffect(() => {
    const imageSrcs = []
    // const imageSrcs = 
    //   dirToArray("tap-perfect", 0, 30).concat(
    //     dirToArray("tap-good", 0, 30)
    //   ).concat(
    //     dirToArray("tap-miss", 0, 30)
    //   ).concat(
    //     dirToArray("hold-perfect", 0, 60)
    //   ).concat(
    //     dirToArray("hold-good", 0, 60)
    //   ).concat(
    //     dirToArray("hold-end", 0, 30)
    //   ).concat(
    //     dirToArray("circle-perfect", 0, 30)
    //   ).concat(
    //     dirToArray("circle-good", 0, 30)
    //   ).concat(
    //     dirToArray("circle-miss", 0, 30)
    //   ).concat(
    //     dirToArray("combo", 0, 20)
    //   )
    
    // console.log(imageSrcs)
    cacheImages(imageSrcs)
  }, [])

  return (
    <div id="app" style={{backgroundColor: "black"}}>
      {/* <CheckBrowserView></CheckBrowserView>
      <CheckDimensionView></CheckDimensionView> */}
      <div style={{position: "absolute", zIndex: 10, height: "100vh", width: "100vw"}}>
        {isDownloadingImages ?
          "" :
          <AnimationView 
            height={"100px"} 
            width={"100px"} 
            x={"100px"} 
            y={"100px"} 
            dirName={"tap-perfect"} 
            start={0} end={29} loop={false}
            onComplete={() => {}}
          ></AnimationView> 
          // {
          //   "main": <MainView setView={setView} settingsObj={settingsObj} showTransition={showMainViewTransitionInRef.current} setShowTransition={setShowMainViewTransitionInRef}></MainView>,
          //   "videos": <VideoSelectorView setView={setView} setVideoInfoRef={setVideoInfoRef} settingsObj={settingsObj} setSettingsObj={setSettingsObj}/>,
          //   "analyzer": <AnalyzerView setView={setView} setBeatmapObjRef={setBeatmapObjRef} settingsObj={settingsObj} videoId={videoInfoRef.current.id.videoId}/>,
          //   "game": <GameView setView={setView} incrementGameId={incrementGameId} setResultsObjRef={setResultsObjRef} settingsObj={settingsObj} setSettingsObj={setSettingsObj} beatmapObj={beatmapObjRef.current} key={gameId}/>,
          //   "results": <ResultsView setView={setView} incrementGameId={incrementGameId} resultsObj={resultsObjRef.current} settingsObj={settingsObj} videoInfo={videoInfoRef.current}/>,
          //   "test": <TestView/>
          // } [view]
        }
      </div>
    </div>
  )
}

export default App