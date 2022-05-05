import React, { useEffect, useState } from 'react';

const AnalyzerView = ({ setView, setBeatmapObjRef }) => {

    const [displayText, setDisplayText] = useState("fetching data...")
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        fetch("/videoBPM")
        .then(response => response.json())
        .then(json => {
            const beatmapObj = json
            beatmapObj.refreshRate = 0.01 * 1000
            beatmapObj.refreshTolerance = 0.0099
            setDisplayText("analysis completed")
            setBeatmapObjRef(beatmapObj)
            setShowButton(true)
        })
    }, [])

    const handleClick = () => {
        setView("game")
    }

    return (
        <div>
            <h1>{displayText}</h1>
            {
                showButton ? <button onClick={handleClick}>Start Game</button> : null
            }
        </div>
    );
};

export default AnalyzerView;