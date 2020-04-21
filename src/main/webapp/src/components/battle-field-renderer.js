import React from 'react';

import _ from 'underscore'

function renderVHeader(label) {
    const result = [];
    result.push(
        <div key={'hh-' + label} className="col-sm-1 text-center align-middle text-light bg-secondary border border-secondary">
            {label}
        </div>
    );
    return result;
}

function renderCells(x, cells, onCellClick) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y}
                 className={"col-sm-1 border border-primary rounded text-center small " + (cell.isShip ? 'cell-ship' : 'cell-no-ship')}
                 onClick={onCellClick.bind(this, cell)}
            >
                <span className="align-middle">{cell.xLabel + '' + cell.yLabel}</span>
            </div>
        );
    });
    return result;
}

function renderHLine(x, cells, onCellClick) {
    const vHeader = renderVHeader(cells[0].yLabel);
    const result = [];
    result.push(
        <div key={'line-' + x} className="row">
            {vHeader}
            {renderCells(x, cells, onCellClick)}
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

const BattleCellsRenderer = ({cells, onCellClick}) => {

    // console.log('battle-field-renderer', cells);
    const hLines = [];

    for (let x = cells.length - 1; x >= 0; x--) {
        hLines.push(renderHLine(x, cells[x], onCellClick));
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                {renderHHeaders('top', cells)}
                {hLines}
                {renderHHeaders('bottom', cells)}
            </div>
        </div>
    )
}

export default BattleCellsRenderer;
