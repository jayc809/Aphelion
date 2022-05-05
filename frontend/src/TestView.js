import React from 'react';

const TestView = () => {

    const array = Array.apply(null, Array(30)).map(() => {
        return {beatNumber: -1, type: "placeholder", state: 1}
    })
    // console.log(array)
    console.log(array.slice(1, array.length).concat(5))

    return (
        <div>
            
        </div>
    );
};

export default TestView;