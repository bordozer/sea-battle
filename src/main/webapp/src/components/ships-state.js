import React from 'react';

import {getBiggestAliveShip} from 'src/utils/ships-utils'

function _renderShip(ship, size, isPlayer) {
    const result = [];
    for (let i = 1; i <= size; i++) {
        const isShip = i <= ship.size;
        const isKilled = ship.damage === ship.size;
        result.push(
            <div
                key={'ship-stat-line-cell-' + ship.id + '-' + i + '-' + (isPlayer ? '-player' : '-enemy')}
                className={'stat-cell' + (isShip ? ' stat-cell-ship' : '') + (isShip && isKilled ? ' stat-cell-ship-killed' : '') + (isPlayer ? ' pull-right' : '')}
                title={ship.name}
            >
                &nbsp;
            </div>
        );
    }
    return result;
}

const ShipStateRenderer = ({ships, isPlayer}) => {
    if (!ships || ships.length === 0) {
        return "";
    }
    const biggestShip = getBiggestAliveShip(ships);
    console.log("biggestShip", biggestShip);
    const result = [];
    ships.forEach(ship => {
        result.push(
            <div key={'ship-stat-line-' + ship.id} className='row mt-10'>
                <div key={'ship-stat-col-' + ship.id} className='col-sm-12'>
                    {_renderShip(ship, biggestShip.size, isPlayer)}
                </div>
            </div>
        )
    });

    return (
        <div>
            <div className="row mt-10">
                <div className="col-sm-12 text-center">
                    {isPlayer ? 'Player' : 'Enemy'}
                </div>
            </div>
            {result}
        </div>
    )
}

export default ShipStateRenderer;
