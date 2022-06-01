import React, { useEffect, useState } from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar"
import ChangingProgressProvider from "./ChangingProgressProvider"
import "../ResultsView.css"

const CircleProgressBar = ({ size, numerator, denominator, delay, duration }) => {

    const [numeratorDisplay, setNumeratorDisplay] = useState(0)
    const [circle, setCircle] = useState(
        <CircularProgressbar
            value={0}
            strokeWidth={7.5}
            styles={buildStyles({
                textColor: "white",
                pathColor: "white",
                trailColor: "black",
            })}
        ></CircularProgressbar>
    )

    useEffect(() => {
        renderCircle()
    }, [])

    const makeRange = () => {
        const arr = [...Array(21).keys()]
        arr.forEach((val, index) => {arr[index] = parseInt(val / 20 * numerator)})
        return arr
    }

    const renderCircle = () => {
        setTimeout(() => {
            setCircle(
                <ChangingProgressProvider values={makeRange()} interval={duration * 1000 / 20} setText={setNumeratorDisplay}>
                    {process => {
                        return (
                            <CircularProgressbar
                                value={process / denominator * 100}
                                strokeWidth={7.5}
                                styles={buildStyles({
                                    textColor: "white",
                                    pathColor: "white",
                                    trailColor: "black",
                                    pathTransition: `linear ${duration / 20}s`,
                                })}
                            ></CircularProgressbar>
                        )
                    }}
                </ChangingProgressProvider>
            )
        }, delay * 1000)
    }

    return (
        <div className="circluar-progress-bar-wrapper" style={{height: size, width: size}}>
            <h3 className="circluar-progress-bar-numerator" style={{fontSize: `calc(${size} / 8)`}}>{numeratorDisplay}</h3>
            <h3 className="circluar-progress-bar-denominator" style={{fontSize: `calc(${size} / 8)`}}>{denominator}</h3>
            <div className="circluar-progress-bar-line"></div>
            <div className="circluar-progress-bar-foreground-black"></div>
            <div className="circluar-progress-bar-foreground-white"></div>
            <div style={{height: "93.4%", width: "93.4%", zIndex: 100, paddingTop: "0%"}}>
            {
                circle
            }
            </div>
            <div className="circluar-progress-bar-background-black"></div>
            <div className="circluar-progress-bar-background-white"></div>
        </div>
    );
};

export default CircleProgressBar;