import React, { useEffect, useState } from 'react';

const AnalyzerView = () => {

    const [displayText, setDisplayText] = useState("fetching data...")

    useEffect(() => {
        fetch("/videoBPM")
        .then(response => response.json())
        .then(json => {
            console.log(json)
            setDisplayText("analysis completed")
        })
    }, [])

    return (
        <div>
            <h1>{displayText}</h1>
        </div>
    );
};

export default AnalyzerView;