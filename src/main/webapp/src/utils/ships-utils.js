/* jshint esversion: 6 */

export const getBiggestAliveShip = (ships) =>
    ships.filter(ship => {
        return ship.damage < ship.size;
    }).sort(function (ship1, ship2) {
        return ship2.size - ship1.size;
    })[0];


export const getBiggestShip = (ships) =>
    ships.sort(function (ship1, ship2) {
        return ship2.size - ship1.size;
    })[0];

export const getAliveShipsCount = (ships) => {
    const liveShips = ships.filter(ship => {
        return ship.damage < ship.size;
    });
    return liveShips.length;
};
