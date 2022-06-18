import React from 'react'
import "./PopUpView.css"

const LoginView = ({ height, width, x, y, text, fontSize }) => {
    return (
        <div className="pop-up-wrapper" style={{height: height, width: width, left: `calc(${x} - ${width} / 2)`, top: `calc(${y} - ${height} / 2)`,
            position: "absolute", zIndex: 100000, boxSizing: "border-box", border: "0.2vw solid white", backgroundColor: "black", 
            padding: `calc(${width} / 25)`}}
        >
            
        </div>
    )
}

export default LoginView;