import React, { useEffect, useState } from 'react';
import { detect } from "detect-browser"

const CheckBrowserView = () => {

    const [height, setHeight] = useState("0px")
    const [width, setWidth] = useState("0px")
    const [message, setMessage] = useState("")
    const [warning, setWarning] = useState(false)
    
    const cancelWarning = () => {
        localStorage.setItem("suppress-warning", true)
        setHeight("0px")
        setWidth("0px")
        setWarning(false)
    }
    
    useEffect(() => {
        // const isUsingChrome = window.navigator.userAgent.indexOf("Chrome") > -1
        const browser = detect()
        const succeeded = (message) => {
            setMessage(message)
            setHeight("0px")
            setWidth("0px")
        }
        const failed = (message) => {
            setMessage(message)
            setHeight("100vh")
            setWidth("100vw")
        }
        const warning = (message) => {
            if (localStorage.getItem("suppress-warning")) {
                setHeight("0px")
                setWidth("0px")
            } else {
                setMessage(message)
                setHeight("100vh")
                setWidth("100vw")
                setWarning(true)
            }
        }
        console.log(browser && browser.name)
        switch (browser && browser.name) {
            case 'chrome':
                succeeded("")
                return
            case "safari":
                failed("Safari Is Not Supported At The Moment. Consider Using Chrome")
                return
            case "opera":
                warning("While Opera Is Supported, Consider Using Chrome For Best Performance")
                return
            case "firefox":
                warning("While FireFox Is Supported, Consider Using Chrome For Best Performance")
                return
            case "edge":
                warning("While Edge Is Supported, Consider Using Chrome For Best Performance")
                return
            case "edge-chromium": 
                warning("While Edge Is Supported, Consider Using Chrome For Best Performance")
                return

            case "ios": 
                failed("Mobile Is Not Supported At The Moment. Consider Using A Computer")
                return
            case "ios-webview": 
                failed("Mobile Is Not Supported At The Moment. Consider Using A Computer")
                return
            case "edge-ios": 
                failed("Mobile Is Not Supported At The Moment. Consider Using A Computer")
                return
            case "android": 
                failed("Mobile Is Not Supported At The Moment. Consider Using A Computer")
                return
        }
        warning("Unable To Detect Browser Type. Errors May Arise. Consider Using Chrome For Best Performance")
    }, [])

    return (
        <div style={{position: "absolute", zIndex: 10000001, height: height, width: width, backgroundColor: "black", display: "grid", placeItems: "center"}}>
            {
                height == "100vh" ? 
                <h3 style={{fontSize: "3vh", margin: "0"}}>{message}</h3> :
                ""
            }
            {
                warning ?
                <button onClick={cancelWarning} className="next-button" style={{height: "10vh"}}>Proceed</button> :
                ""
            }
        </div>
    );
};

export default CheckBrowserView;