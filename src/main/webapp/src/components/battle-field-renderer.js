import React from 'react';

function renderLineCells(x, cells) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y} className="col-sm-1">
                <button type="button" className="btn btn-light">{cell.xLabel + ':' + cell.yLabel}</button>
            </div>
        );
    });
    return result;
}

function renderLine(x, cells) {
    const result = [];
    const lineCells = renderLineCells(x, cells);
    result.push(
        <div key={'line-' + x} className="row">
            {lineCells}
        </div>
    );
    return result;
}

const BattleCellsRenderer = (cells) => {

    let renderedCells = [];

    console.log('BattleCellsRenderer', cells.cells);
    for (let x = 0; x < 12; x++) {
        renderedCells.push(renderLine(x, cells.cells[x]));
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                {renderedCells}
            </div>
        </div>
    )
}
export default BattleCellsRenderer;
