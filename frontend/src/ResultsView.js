import React from 'react';

const ResultsView = ({ resultsObj }) => {
    return (
        <div>
            <h3>{JSON.stringify(resultsObj)}</h3>
        </div>
    );
};

export default ResultsView;