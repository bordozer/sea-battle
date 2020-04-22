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

    if (isEnemy && !options.isBattleStarted) {
        return 'cell-disabled';
    }
    if (!cell.ship && cell.isHit) {
        return 'cell-no-ship-hit'; // missed shot
    }
    if (isMine && cell.ship && !cell.isHit) {
        return 'cell-ship'; // player's healthy ship
    }
    if (cell.ship && cell.isHit && cell.ship.damage < cell.ship.size) {
        return 'cell-ship-wounded'; // wounded ship
    }
    if (cell.ship && cell.isHit && cell.ship.damage === cell.ship.size) {
        return 'cell-ship-killed'; // killed ship
    }
    return '';
}

function getCellIcon(cell, options) {
    const isEnemy = options.isHiddenShips;
    const isMine = !isEnemy;

    if (isEnemy && !options.isBattleStarted) {
        return 'fa fa-hourglass-o';
    }

    if (!cell.ship && cell.isHit) {
        return 'fa fa-crosshairs'; // missed
    }
    if (isMine && cell.ship && !cell.isHit) {
        return 'fa fa-anchor'; // my ship
    }
    if (!cell.ship && !cell.isHit && cell.isKilledShipNeighborCell) {
        return 'fa fa-genderless'; // player's of enemy's known ship neighbor cell
    }
    if (cell.ship && cell.isHit) {
        return 'fa fa-times'; // cell with wounded/killed ship section
    }
    return '';
}

function renderCells(x, cells, onCellClick, options) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y}
                 className={"col-sm-1 text-center align-middle cell-base cell-text " + cellCss(cell, options) + ' ' + getCellIcon(cell, options)}
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
