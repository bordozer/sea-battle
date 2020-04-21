import React from 'react';

function renderVHeader(x) {
    const result = [];
    result.push(
        <div key={'hh-' + x} className="col-sm-1 text-center align-middle text-light bg-secondary border border-secondary">
            {x}
        </div>
    );
    return result;
}

function renderCells(x, cells) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y} className="col-sm-1 border border-primary rounded text-center small text-muted">
                {cell.xLabel + ':' + cell.yLabel}
            </div>
        );
    });
    return result;
}

function renderHLine(x, cells) {
    const vHeader = renderVHeader(x);
    const result = [];
    result.push(
        <div key={'line-' + x} className="row">
            {vHeader}
            {renderCells(x, cells)}
            {vHeader}
        </div>
    );
    return result;
}

function renderHHeader(cells) {
    const result = [];
    result.push(
        <div key="v-left" className="col-sm-1 bg-secondary border border-secondary" />
    );
    cells.forEach(cell => {
        result.push(
            <div key={'v-' + cell.x} className="col-sm-1 text-center text-light bg-secondary">
                {cell.xLabel}
            </div>
        );
    })
    result.push(
        <div key="v-right" className="col-sm-1 bg-secondary border border-secondary" />
    );
    return result;
}

function renderHHeaders(position, cells) {
    const result = [];
    result.push(
        <div key={'h-' + position} className="row">
            {renderHHeader(cells[0])}
        </div>
    );
    return result;
}

const BattleCellsRenderer = (cells) => {

    const cellsList = cells.cells;

    const hLines = [];

    for (let x = cellsList.length - 1; x >= 0; x--) {
        hLines.push(renderHLine(x, cellsList[x]));
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                {renderHHeaders('top', cellsList)}
                {hLines}
                {renderHHeaders('bottom', cellsList)}
            </div>
        </div>
    )
}

export default BattleCellsRenderer;
