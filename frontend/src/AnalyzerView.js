import React, { useEffect, useState, useRef } from 'react'
import socketIOClient from "socket.io-client"
import "./App.css"
import "./AnalyzerView.css"

const AnalyzerView = ({ setView, setBeatmapObjRef }) => {

    const [displayText, setDisplayText] = useState("")
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const videoUrl = "https://www.youtube.com/watch?v=IKKar5SS29E"
        // const videoUrl = "https://www.youtube.com/watch?v=3cqV5BKJHyk"
        // const videoUrl = "https://www.youtube.com/watch?v=8-vBG40_c_Y"
        const socket = socketIOClient("http://localhost:5000")
        socket.on("connected-to-server", () => {
            socket.emit("request-beatmap", videoUrl)
            socket.on("progress-update", (message) => {
                setDisplayText(message)
            })
            socket.on("respond-beatmap", (beatmapObjRes) => {
                const beatmapObj = beatmapObjRes
                beatmapObj.refreshRate = 0.01 * 1000
                beatmapObj.refreshTolerance = 0.008
                socket.disconnect()
                setBeatmapObjRef(beatmapObj)
                setShowButton(true)
            })
        })
    }, [])

    useEffect(() => {

    }, [displayText])

    const handleStartGame = () => {
        setView("game")
    }

    return (
        <div className="analyzer-view-wrapper">
            <h1 className="progress-text">{displayText}</h1>
            {
                showButton ? <button className="start-button" onClick={handleStartGame}>Start Game</button> : null
            }
        </div>
    )

    const fetchExpress = () => {
        // fetch(`/getBeatmap?videoUrl=${test}`)
        // .then(response => response.json())
        // .then(json => {
        //     console.log(json)
        //     const beatmapObj = json
        //     beatmapObj.refreshRate = 0.01 * 1000
        //     beatmapObj.refreshTolerance = 0.0099
        //     setDisplayText("analysis completed")
        //     setBeatmapObjRef(beatmapObj)
        //     setShowButton(true)
        // })
    }
}

export default AnalyzerView;