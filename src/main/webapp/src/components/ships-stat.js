import React from 'react';

function _renderShip(ship) {
    const result = [];
    for (let i = 1; i <= 4; i++) {
        const isShip = i <= ship.size;
        const isKilled = ship.damage === ship.size;
        result.push(
            <div className={'stat-cell' + (isShip ? ' stat-cell-ship' : '') + (isShip && isKilled ? ' stat-cell-ship-killed' : '')}>
                &nbsp;
            </div>
        );
    }
    return result;
}

const ShipStatisticsRenderer = ({ships}) => {
    console.log(ships);
    const result = [];
    ships.forEach(ship => {
        result.push(
            <div className='row mt-10'>
                <div className='col-sm-12'>
                    {_renderShip(ship)}
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
