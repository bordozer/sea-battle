import React from 'react';

const DifficultyLevelRenderer = ({level, onChange}) => {

    return (
        <div className="row mt-10">
            <div className="col-sm-3 small">
                Difficulty level:
            </div>
            <div className="col-sm-3">
                <input type="radio"
                       name="difficulty"
                       value='1'
                       checked={level === 1}
                       onChange={onChange.bind(this, 1)}/> <span className="text-muted">low</span>
            </div>
            <div className="col-sm-3">
                <input type="radio"
                       name="difficulty"
                       value='2'
                       checked={level === 2}
                       onChange={onChange.bind(this, 2)}/> <span className="text-success">medium</span>
            </div>
            <div className="col-sm-3">
                <input type="radio"
                       name="difficulty"
                       value='3'
                       checked={level === 3}
                       onChange={onChange.bind(this, 3)}/> <span className="text-danger">high</span>
            </div>
        </div>
    )
};

export default DifficultyLevelRenderer;
