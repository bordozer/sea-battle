import React from 'react';

function _renderShip(ship) {
    const result = [];
    for (let i = 1; i <= 4; i++) {
        const isShipCell = i <= ship.size;
        result.push(
            <div
                key={'ship-' + ship.id + '-' + i}
                className={'col-sm-3 border-light' + (isShipCell ? ' bg-primary' : '')}
            >
                {isShipCell ? '.' : ''}
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
                {_renderShip(ship)}
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