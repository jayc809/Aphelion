import React, { useState } from 'react';
import "../styles/SettingsList.css"

const StepperButton = ({ min, max, start, step, round, setVal }) => {

    const [valDisplay, setValDisplay] = useState(start.toFixed(round))

    const handleDecrease = () => {
        if (valDisplay > min) {
            const val = parseFloat(Number(parseFloat(valDisplay) - step).toFixed(round))
            setValDisplay(val.toFixed(round))
            setVal(val)
        }
    }

    const handleIncrease = () => {
        if (valDisplay < max) {
            const val = parseFloat(Number(parseFloat(valDisplay) + step).toFixed(round))
            setValDisplay(val.toFixed(round))
            setVal(val)
        }
    }

    return (
        <div className="stepper-button-wrapper">
            <button className="stepper-button-incrementer-decrease" onClick={handleDecrease}>◄</button>
            <div>{valDisplay}</div>
            <button className="stepper-button-incrementer-increase" onClick={handleIncrease}>►</button>
        </div>
    );
};

export default StepperButton;