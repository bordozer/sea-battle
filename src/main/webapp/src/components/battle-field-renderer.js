import React from 'react';

function renderLineCells(x, cells) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y}
                 className="col-sm-1 border border-primary rounded text-center small">
                <button type="button" className="btn btn-light text-muted">{cell.xLabel + ':' + cell.yLabel}</button>
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

function hHeaders(cells) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div className="col-sm-1 text-center bg-warning border border-secondary">
                {cell.xLabel}
            </div>
        );
    })
    return result;
}

function hHeadersLine(cells) {
    const result = [];
    result.push(
        <div className="row">
            {hHeaders(cells[0])}
        </div>
    );
    return result;
}

const BattleCellsRenderer = (cells) => {

    const hHeads = hHeadersLine(cells.cells);

    const renderedCells = [];
    for (let x = cells.cells.length - 1; x >= 0; x--) {
        renderedCells.push(renderLine(x, cells.cells[x]));
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                {hHeads}
                {renderedCells}
                {hHeads}
            </div>
        </div>
    )
}
export default BattleCellsRenderer;
