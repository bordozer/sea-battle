import React from 'react';

function _renderShip(ship) {
    const result = [];
    for (let i = 1; i <= 4; i++) {
        const isShipCell = i <= ship.size;
        result.push(
            <div className={isShipCell ? 'ship-stat-cell' : ''}>
                []
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
            <div key={'ship-' + ship.id} className='row'>
                <div key={'ship-' + ship.id + '-' + ship.size} className='col-sm-12'>
                    {_renderShip(ship)}
                </div>
            </div>)
    });

    return (
        <div className='row'>
            <div className='col-sm-12'>
                {result}
            </div>
        </div>
    )
}

export default ShipStatisticsRenderer;
