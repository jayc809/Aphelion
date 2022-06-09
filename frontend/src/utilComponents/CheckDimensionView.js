import React, { useEffect, useState } from 'react';

const CheckDimensionView = () => {

    const [height, setHeight] = useState("0px")
    const [width, setWidth] = useState("0px")

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleResize = () => {
        const aspectRatio = window.innerWidth / window.innerHeight 
        if (aspectRatio > 2.2 || aspectRatio < 1.32) {
            setHeight("100vh")
            setWidth("100vw")
        } else {
            setHeight("0px")
            setWidth("0px")
        }
    }

    return (
        <div style={{position: "absolute", zIndex: 10000000, height: height, width: width, backgroundColor: "black", display: "grid", placeItems: "center"}}>
            {
                height == "100vh" ? 
                <h3 style={{fontSize: "5vh"}}>Window Dimension Not Supported At This Moment</h3> :
                ""
            }
        </div>
    );
};

export default CheckDimensionView;