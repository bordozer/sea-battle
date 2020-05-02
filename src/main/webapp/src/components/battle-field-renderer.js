import React from 'react';

import _ from 'underscore'

function getBorderCss(options) {
    return options.highlightBattleArea ? 'bg-success' : 'bg-secondary';
}
function renderVHeader(label, options) {
    const moveCss = getBorderCss(options);
    const result = [];
    result.push(
        <div key={'hh-' + label} className={"col-sm-1 text-center align-middle text-light bg-secondary border border-secondary cell-base battle-field-border " + moveCss}>
            {label}
        </div>
    );
    return result;
}

function cellCss(cell, options) {
    const result = [];

    const isPlayer = options.isPlayer;
    const isEnemy = !options.isPlayer;
    const stage = options.stage;
    const lastShot = options.lastShot;

    const isLastShoot = lastShot && (cell.x === lastShot.x) && (cell.y === lastShot.y);

    if (options.stage === null || (isEnemy && stage === 'STEP_READY_TO_START')) {
        result.push('cell-disabled');
        result.push('fa fa-anchor');
    }

    /*if (cell.ship && !cell.isHit) {
        result.push('cell-ship');
        // result.push('fa fa-smile-o');
    }
    if (cell.isShipNeighbor) {
        result.push('fa fa-bug');
    }*/

    // show enemy's healthy ships at the end
    if (isEnemy && stage === 'STEP_FINAL' && cell.ship && !cell.isHit) {
        result.push('cell-ship');
        result.push('fa fa-smile-o');
    }

    // player's healthy ship
    if (isPlayer && cell.ship && !cell.isHit) {
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
        result.push('cell-not-hittable');
    }

    // missed shot
    if (!isLastShoot && !cell.ship && cell.isHit) {
        result.push('cell-missed-hit');
        result.push('cell-not-hittable');
        // result.push('fa fa-crosshairs');
        result.push('fa fa-circle-o');
    }
    if (isLastShoot) {
        result.push('text-primary');
        result.push('fa fa-crosshairs');
    }
    if (isLastShoot && !cell.ship) {
        result.push('cell-not-hittable');
    }

    const recommendedShots = options.recommendedShots.shoots;
    const strategy = options.recommendedShots.strategy;
    const isRecommendedShot = recommendedShots.filter(c => {
        return c.x === cell.x && c.y === cell.y;
    }).length > 0;
    if (isRecommendedShot) {
        result.push('cell-recommended-shot');
        if (strategy === 'level3') {
            result.push('fa fa-bullseye');
        }
        if (strategy === 'level2') {
            result.push('fa fa-dot-circle-o');
        }
    }
    return result;
}

function renderCells(x, cells, onCellClick, options) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y}
                 className={"col-sm-1 text-center align-middle cell-base cell-text " + cellCss(cell, options).join(' ')}
                 onClick={onCellClick.bind(this, cell)}
                 title={cell.xLabel + '' + cell.yLabel + (options.isPlayer && cell.ship ? ' - ' + cell.ship.name : '')}
            >
                {/*{cell.ship ? 'x' : ''}*/}
                {/*{cell.isShipNeighbor ? 'n' : ''}*/}
            </div>
        );
    });
    return result;
}

function renderHLine(x, cells, onCellClick, options) {
    const vHeader = renderVHeader(cells[0].yLabel, options);
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

function renderHHeader(cells, options) {
    const result = [];
    const moveCss = getBorderCss(options);
    // console.log("options/moveCss", options, moveCss);
    result.push(
        <div key="v-left" className={"col-sm-1 border border-secondary cell-base " + moveCss}/>
    );
    cells.forEach(cell => {
        result.push(
            <div key={'v-' + cell.x} className={"col-sm-1 text-center text-light bg-secondary cell-base battle-field-border " + moveCss}>
                {cell.xLabel}
            </div>
        );
    })
    result.push(
        <div key="v-right" className={"col-sm-1 bg-secondary border border-secondary cell-base " + moveCss}/>
    );
    return result;
}

function renderHHeaders(position, cells, options) {
    const result = [];
    result.push(
        <div key={'h-' + position} className="row">
            {renderHHeader(cells[0], options)}
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
                {renderHHeaders('top', cells, options)}
                {hLines}
                {renderHHeaders('bottom', cells, options)}
            </div>
        </div>
    )
};

export default BattleCellsRenderer;
