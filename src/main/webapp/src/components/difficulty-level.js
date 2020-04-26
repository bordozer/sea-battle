import React from 'react';

const DifficultyLevelRenderer = ({level, onChange}) => {

    return (
        <div>
            <div className="row mt-10">
                <div className="col-sm-3 small"/>
                <div className="col-sm-3 text-center small">
                    <span className="text-muted">LOW</span>
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-success">MEDIUM</span>
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-danger">HIGH</span>
                </div>
            </div>

            <div className="row mt-10">
                <div className="col-sm-3 small">
                    Difficulty
                </div>
                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className=" form-control"
                           value='1'
                           checked={level === 1}
                           onChange={onChange.bind(this, 1)}/>
                </div>
                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className=" form-control"
                           value='2'
                           checked={level === 2}
                           onChange={onChange.bind(this, 2)}/>
                </div>
                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className=" form-control"
                           value='3'
                           checked={level === 3}
                           onChange={onChange.bind(this, 3)}/>
                </div>
            </div>
        </div>
    )
};

export default DifficultyLevelRenderer;
