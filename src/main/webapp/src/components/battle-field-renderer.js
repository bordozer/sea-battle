/* jshint esversion: 6 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnchor, faTimes, faCrosshairs, faBullseye, faSkull, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import { faSmile, faCircle, faDotCircle } from '@fortawesome/free-regular-svg-icons';
import _ from 'underscore';

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

    const isLastShot = lastShot && (cell.x === lastShot.x) && (cell.y === lastShot.y);

    if (options.stage === null || (isEnemy && stage === 'STEP_READY_TO_START')) {
        result.push('cell-disabled');
    }

    // show enemy's healthy ships at the end
    if (isEnemy && stage === 'STEP_FINAL' && cell.ship && !cell.isHit) {
        result.push('cell-ship');
    }

    // player's healthy ship
    if (isPlayer && cell.ship && !cell.isHit) {
        result.push('cell-ship');
    }
    // wounded ship
    if (cell.ship && cell.isHit && cell.ship.damage < cell.ship.size) {
        result.push('cell-ship-wounded');
    }
    // killed ship
    if (cell.ship && cell.isHit && cell.ship.damage === cell.ship.size) {
        result.push('cell-ship-killed');
    }

    // player's of enemy's known ship neighbor cell
    if (!cell.ship && !cell.isHit && cell.isKilledShipNeighborCell) {
        result.push('cell-not-hittable');
    }

    // missed shot
    if (!isLastShot && !cell.ship && cell.isHit) {
        result.push('cell-missed-hit');
        result.push('cell-not-hittable');
    }
    if (isLastShot) {
        result.push('cell-last-shot');
    }
    if (isLastShot && !cell.ship) {
        result.push('cell-not-hittable');
    }

    return result;
}

function getIcon(cell, options) {
    const isPlayer = options.isPlayer;
    const isEnemy = !options.isPlayer;
    const stage = options.stage;

    const lastShot = options.lastShot;
    const isLastShot = lastShot && (cell.x === lastShot.x) && (cell.y === lastShot.y);

    if (options.stage === null || (isEnemy && stage === 'STEP_READY_TO_START')) {
        return (
            <FontAwesomeIcon icon={faAnchor} />
        );
    }
    if (isEnemy && stage === 'STEP_FINAL' && cell.ship && !cell.isHit) {
        return (
            <FontAwesomeIcon icon={faSmile} />
        );
    }
    if (isPlayer && cell.ship && !cell.isHit) {
        return (
            <FontAwesomeIcon icon={faAnchor} />
        );
    }
    if (cell.ship && cell.isHit && cell.ship.damage < cell.ship.size) {
        return (
            <FontAwesomeIcon icon={faSkull} />
        );
    }
    if (cell.ship && cell.isHit && cell.ship.damage === cell.ship.size) {
        return (
            <FontAwesomeIcon icon={faSkullCrossbones} />
        );
    }
    if (!isLastShot && !cell.ship && cell.isHit) {
        return (
            <FontAwesomeIcon icon={faCircle} />
        );
    }
    if (isLastShot) {
        return (
            <FontAwesomeIcon icon={faCrosshairs} />
        );
    }
    const recommendedShots = options.recommendedShots.shots;
    const strategy = options.recommendedShots.strategy;
    const isRecommendedShot = recommendedShots.filter(c => {
        return c.x === cell.x && c.y === cell.y;
    }).length > 0;
    if (isRecommendedShot) {
        if (strategy === 'level2') {
            return (
                <FontAwesomeIcon icon={faDotCircle} />
            );
        }
        if (strategy === 'level3') {
            return (
                <FontAwesomeIcon icon={faBullseye} />
            );
        }
    }

    return ('');
}

function renderCells(x, cells, onCellClick, options) {
    const result = [];
    cells.forEach(cell => {
        result.push(
            <div key={x + '_' + cell.x + '-' + cell.y}
                 className={"col-sm-1 cell-base " + cellCss(cell, options).join(' ')}
                 onClick={onCellClick.bind(this, cell)}
                 title={cell.xLabel + '' + cell.yLabel + (options.isPlayer && cell.ship ? ' - ' + cell.ship.name : '')}
            >
                {getIcon(cell, options)}
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
