import React from 'react'
import "./PopUpView.css"

const LoginView = ({ height, width, x, y, text, fontSize }) => {
    return (
        <div className="pop-up-wrapper" style={{height: height, width: width, left: `calc(${x} - ${width} / 2)`, top: `calc(${y} - ${height} / 2)`,
            position: "absolute", zIndex: 100000, backgroundImage: "url('../images/pause-menu.png')", backgroundRepeat: "no-repeat", backgroundSize: "contain", backgroundColor: "black",
            padding: `calc(${width} / 25)`}}
        >
            <div style={{ height: "33%", width: "100%", display: "flex"}}>
                <div style={{height: "100%", width: "46%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>Username:</div>
                <div style={{height: "100%", width: "54%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>
                    <input style={{height: "4.5vh", width: "75%", fontSize: "3.8vh", fontFamily: "Futura-Light", backgroundColor: "black", border: "0", color: "white", borderBottom: "0.2vh solid white"}}></input>
                </div>
            </div>
            <div style={{ height: "33%", width: "100%", display: "flex"}}>
                <div style={{height: "100%", width: "46%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>Password:</div>
                <div style={{height: "100%", width: "54%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>
                    <input style={{height: "4.5vh", width: "75%", fontSize: "3.8vh", fontFamily: "Futura-Light", backgroundColor: "black", border: "0", color: "white", borderBottom: "0.2vh solid white"}}></input>
                </div>
            </div>
            <div style={{height: "33%", width: "100%", display: "flex"}}>
                <div style={{height: "100%", width: "50%", display: "grid", placeItems: "center", paddingLeft: "1vw"}}>
                    <button className="pause-menu-button" style={{cursor: "pointer"}}>Register</button>
                </div>
                <div style={{height: "100%", width: "50%",  display: "grid", placeItems: "center", paddingRight: "1vw"}}>
                    <button className="pause-menu-button" style={{cursor: "pointer"}}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default LoginView;