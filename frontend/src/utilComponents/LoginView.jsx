import React, { useEffect, useState } from 'react'
import "./PopUpView.css"

const LoginView = ({ height, width, x, y, text, fontSize, user, setUser, setCanStartRef }) => {

    const [displayText, setDisplayText] = useState("User Login")
    const [responseCode, setResponseCode] = useState(0)

    useEffect(() => {
        if (user) {
            setResponseCode(201)
            setDisplayText(`User ${user} Logged In`)
        }
    }, [])

    const checkInput = (username, password) => {
        if (username == "") {
            setDisplayText("Username Cannot Be Empty")
            setResponseCode(500)
            return false
        }
        if (password == "") {
            setDisplayText("Password Cannot Be Empty")
            setResponseCode(500)
            return false
        }
        return true
    }

    const handleLogin = () => {
        setCanStartRef(false)

        const username = document.getElementById("username-input-el").value
        const password = document.getElementById("password-input-el").value

        if (!checkInput(username, password)) {
            return
        }

        fetch("http://localhost:5000/login-user", {
            method: 'POST', 
            mode: 'cors', 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username,
                password: password
            }) 
        })
            .then(res => {
                setResponseCode(res.status)
                return res.json()
            }) 
            .then(res => {
                setDisplayText(res.message)
                if (res.success) {
                    setUser(res.username)
                }
            })
            setCanStartRef(true)
    }

    const handleRegister = () => {
        setCanStartRef(false)

        const username = document.getElementById("username-input-el").value
        const password = document.getElementById("password-input-el").value

        if (!checkInput(username, password)) {
            return
        }
        
        fetch("http://localhost:5000/register-user", {
            method: 'POST', 
            mode: 'cors', 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username,
                password: password
            }) 
        })
            .then(res => {
                setResponseCode(res.status)
                return res.json()
            }) 
            .then(res => {
                setDisplayText(res.message)
            })
        setCanStartRef(true)
    }

    return (
        <div className="pop-up-wrapper" style={{height: height, width: width, left: `calc(${x} - ${width} / 2)`, top: `calc(${y} - ${height} / 2)`,
            position: "absolute", zIndex: 100000, backgroundImage: "url('../images/pause-menu.png')", backgroundRepeat: "no-repeat", backgroundSize: "contain", backgroundColor: "black",
            padding: `calc(${width} / 25)`}}
        >
            <div style={{ 
                height: "24%", width: "100%", display: "flex", fontSize: "3.8vh", display: "grid", placeItems: "center", paddingTop: "1%", 
                color: {0: "white", 201: "#33ff9e", 500: "#ff445e"}[responseCode]
            }}>
                {displayText}
            </div>
            <div style={{ height: "22%", width: "100%", display: "flex"}}>
                <div style={{height: "100%", width: "46%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>Username:</div>
                <div style={{height: "100%", width: "54%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>
                    <input id="username-input-el" style={{height: "4.5vh", width: "75%", fontSize: "3.8vh", fontFamily: "Futura-Light", backgroundColor: "black", border: "0", color: "white", borderBottom: "0.2vh solid white"}}></input>
                </div>
            </div>
            <div style={{ height: "22%", width: "100%", display: "flex"}}>
                <div style={{height: "100%", width: "46%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>Password:</div>
                <div style={{height: "100%", width: "54%", fontSize: "3.8vh", display: "grid", placeItems: "center"}}>
                    <input id="password-input-el" style={{height: "4.5vh", width: "75%", fontSize: "3.8vh", fontFamily: "Futura-Light", backgroundColor: "black", border: "0", color: "white", borderBottom: "0.2vh solid white"}}></input>
                </div>
            </div>
            <div style={{height: "30%", width: "100%", display: "flex"}}>
                <div style={{height: "100%", width: "50%", display: "grid", placeItems: "center", paddingLeft: "1vw", paddingTop: "2%"}}>
                    <button className="pause-menu-button" style={{cursor: "pointer", width: "80%"}} onClick={handleRegister}>Register</button>
                </div>
                <div style={{height: "100%", width: "50%",  display: "grid", placeItems: "center", paddingRight: "1vw", paddingTop: "2%"}}>
                    <button className="pause-menu-button" style={{cursor: "pointer", width: "80%"}} onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default LoginView;