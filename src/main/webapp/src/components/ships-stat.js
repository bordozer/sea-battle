import React from 'react';

function _renderShip(ship, isPlayer) {
    const result = [];
    for (let i = 1; i <= 4; i++) {
        const isShip = i <= ship.size;
        const isKilled = ship.damage === ship.size;
        result.push(
            <div
                key={'ship-stat-line-cell-' + ship.id + '-' + i + '-' + (isPlayer ? '-player' : '-enemy')}
                className={'stat-cell' + (isShip ? ' stat-cell-ship' : '') + (isShip && isKilled ? ' stat-cell-ship-killed' : '') + (isPlayer ? ' pull-right' : '')}>
                &nbsp;
            </div>
        );
    }
    return result;
}

const ShipStatisticsRenderer = ({ships, isPlayer}) => {
    // console.log(ships);
    const result = [];
    ships.forEach(ship => {
        result.push(
            <div key={'ship-stat-line-' + ship.id} className='row mt-10'>
                <div key={'ship-stat-col-' + ship.id} className='col-sm-12'>
                    {_renderShip(ship, isPlayer)}
                </div>
            </div>
        )
    });

    return (
        <div>
            {result}
        </div>
    )
}

export default ShipStatisticsRenderer;
