import React from 'react';

const GameConfigRenderer = ({difficulty, showShotHints, onDifficultyChange, onShowShotHintsChange}) => {

    return (
        <div>
            <div className="row mt-10">
                <div className="col-sm-3 text-center small">
                    <span className="text-muted">HINTS</span>
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-success">EASY</span>
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-warning">MEDIUM</span>
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-danger">HARD</span>
                </div>
            </div>

            <div className="row mt-10">

                <div className="col-sm-3 small" >
                    <input type="checkbox"
                           name="showShotHints"
                           className="form-control"
                           checked={showShotHints}
                           value="true"
                           onChange={onShowShotHintsChange}/>
                </div>

                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className="form-control"
                           value='1'
                           checked={difficulty === 1}
                           onChange={onDifficultyChange.bind(this, 1)}/>
                </div>
                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className="form-control"
                           value='2'
                           checked={difficulty === 2}
                           onChange={onDifficultyChange.bind(this, 2)}/>
                </div>
                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className="form-control"
                           value='3'
                           checked={difficulty === 3}
                           onChange={onDifficultyChange.bind(this, 3)}/>
                </div>
            </div>
        </div>
    )
};

export default GameConfigRenderer;
