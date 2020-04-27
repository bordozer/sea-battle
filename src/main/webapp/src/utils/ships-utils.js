import React from 'react';

export const getBiggestAliveShip = (playerShips) => {
    return playerShips
        .filter(ship => {
            return ship.damage === 0;
        })
        .sort(function (ship1, ship2) {
            return ship2.size - ship1.size;
        })[0];
}

export const getAliveShipsCount = (ships) => {
    const liveShips = ships.filter(ship => {
        return ship.damage < ship.size;
    });
    return liveShips.length;
}
