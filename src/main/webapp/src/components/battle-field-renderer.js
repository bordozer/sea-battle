import React from 'react';

import _ from 'underscore'

function renderVHeader(label) {
    const result = [];
    result.push(
        <div key={'hh-' + label} className="col-sm-1 text-center align-middle text-light bg-secondary border border-secondary cell-base">
            {label}
        </div>
    );
    return result;
}

function cellCss(cell, options) {
    const isEnemy = options.isHiddenShips;
    const isMine = !isEnemy;
    const result = [];

    if (isEnemy && !options.isBattleStarted) {
        result.push('cell-disabled');
        result.push('fa fa-hourglass-o');
    }
    // missed shot
    if (!cell.ship && cell.isHit) {
        result.push('cell-no-ship-hit');
        result.push('fa fa-crosshairs');
    }
    // player's healthy ship
    if (isMine && cell.ship && !cell.isHit) {
        result.push('cell-ship');
        result.push('fa fa-anchor');
    }
    // wounded ship
    if (cell.ship && cell.isHit && cell.ship.damage < cell.ship.size) {
        result.push('cell-ship-wounded');
        result.push('fa fa-times');
    }
    // killed ship
    if (cell.ship && cell.isHit && cell.ship.damage === cell.ship.size) {
        result.push('cell-ship-killed');
        result.push('fa fa-times');
    }
    // player's of enemy's known ship neighbor cell
    if (!cell.ship && !cell.isHit && cell.isKilledShipNeighborCell) {
        result.push('fa fa-genderless');
    }
    if (!cell.ship && cell.isKilledShipNeighborCell) {
        result.push('cell-killed-ship-neighbor');
    }
    return result.join(' ');
}

function renderCells(x, cells, onCellClick, options) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y}
                 className={"col-sm-1 text-center align-middle cell-base cell-text " + cellCss(cell, options)}
                 onClick={onCellClick.bind(this, cell)}
                 title={cell.xLabel + '' + cell.yLabel + (cell.ship ? ' - ' + cell.ship.name : '')}
            >
            </div>
        );
    });
    return result;
}

function renderHLine(x, cells, onCellClick, options) {
    const vHeader = renderVHeader(cells[0].yLabel);
    const result = [];
    result.push(
        <div key={'line-' + x} className="row">
            {vHeader}
            {renderCells(x, cells, onCellClick, options)}
            {vHeader}
        </div>
    );
    return result;
}

function renderHHeader(cells) {
    const result = [];
    result.push(
        <div key="v-left" className="col-sm-1 bg-secondary border border-secondary cell-base"/>
    );
    cells.forEach(cell => {
        result.push(
            <div key={'v-' + cell.x} className="col-sm-1 text-center text-light bg-secondary cell-base">
                {cell.xLabel}
            </div>
        );
    })
    result.push(
        <div key="v-right" className="col-sm-1 bg-secondary border border-secondary cell-base"/>
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

const BattleCellsRenderer = ({cells, onCellClick, options}) => {

    // console.log('battle-field-renderer', cells);
    const hLines = [];

    for (let x = cells.length - 1; x >= 0; x--) {
        hLines.push(renderHLine(x, cells[x], onCellClick, options));
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
