import React from 'react';

const TestView = () => {

    const array = Array.apply(null, Array(3)).map(() => {
        return {beatNumber: -1, type: "placeholder", state: 1}
    })
    const array2 = Array.apply(null, Array(2)).map(() => {
        return {beatNumber: -1, type: "placeholder", state: 1}
    })
    // console.log(array)
    console.log(array.concat("hehe").concat(array2))

    return (
        <div>
            
        </div>
    );
};

export default TestView;