import React from 'react';

function renderLineHeader(x) {
    const result = [];
    result.push(
        <div key={'hh-' + x} className="col-sm-1 text-center bg-warning border border-secondary">
            {x}
        </div>
    );
    return result;
}

function renderLineCells(x, cells) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y} className="col-sm-1 border border-primary rounded text-center small">
                <button type="button" className="btn btn-light text-muted">{cell.xLabel + ':' + cell.yLabel}</button>
            </div>
        );
    });
    return result;
}

function renderLine(x, cells) {
    const lineHeader = renderLineHeader(x);
    const result = [];
    result.push(
        <div key={'line-' + x} className="row">
            {lineHeader}
            {renderLineCells(x, cells)}
            {lineHeader}
        </div>
    );
    return result;
}

function hHeaders(cells) {
    const result = [];
    result.push(
        <div key="v-left" className="col-sm-1  bg-warning border border-secondary" />
    );
    cells.forEach(cell => {
        result.push(
            <div key={'v-' + cell.x} className="col-sm-1 text-center bg-warning border border-secondary">
                {cell.xLabel}
            </div>
        );
    })
    result.push(
        <div key="v-right" className="col-sm-1  bg-warning border border-secondary" />
    );
    return result;
}

function hHeadersLine(position, cells) {
    const result = [];
    result.push(
        <div key={'h-' + position} className="row">
            {hHeaders(cells[0])}
        </div>
    );
    return result;
}

const BattleCellsRenderer = (cells) => {

    const renderedCells = [];

    for (let x = cells.cells.length - 1; x >= 0; x--) {
        renderedCells.push(renderLine(x, cells.cells[x]));
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                {hHeadersLine('top', cells.cells)}
                {renderedCells}
                {hHeadersLine('bottom', cells.cells)}
            </div>
        </div>
    )
}
export default BattleCellsRenderer;
