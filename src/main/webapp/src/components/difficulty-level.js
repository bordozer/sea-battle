import React from 'react';

const DifficultyLevelRenderer = ({level, showShootHints, onDifficultyChange, onShowShootHintsChange}) => {

    return (
        <div>
            <div className="row mt-10">
                <div className="col-sm-3 text-center small">
                    Show hints
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-muted">EASY</span>
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-success">MEDIUM</span>
                </div>
                <div className="col-sm-3 text-center small">
                    <span className="text-danger">HARD</span>
                </div>
            </div>

            <div className="row mt-10">

                <div className="col-sm-3 small" >
                    <input type="checkbox"
                           name="showShootHints"
                           className="form-control"
                           checked={showShootHints}
                           value="true"
                           onChange={onShowShootHintsChange}/>
                </div>

                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className="form-control"
                           value='1'
                           checked={level === 1}
                           onChange={onDifficultyChange.bind(this, 1)}/>
                </div>
                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className="form-control"
                           value='2'
                           checked={level === 2}
                           onChange={onDifficultyChange.bind(this, 2)}/>
                </div>
                <div className="col-sm-3 text-center">
                    <input type="radio"
                           name="difficulty"
                           className="form-control"
                           value='3'
                           checked={level === 3}
                           onChange={onDifficultyChange.bind(this, 3)}/>
                </div>
            </div>
        </div>
    )
};

export default DifficultyLevelRenderer;
