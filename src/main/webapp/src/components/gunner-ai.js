import React from 'react';

import {getSpaciousRooms} from 'src/utils/ships-utils'
import {randomElement} from 'src/utils/random-utils'

function _getRandomFreeCell(cells) {
    const hitableCells = [];
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells.length; y++) {
            const cell = cells[x][y];
            if (!cell.isHit && !cell.isKilledShipNeighborCell) {
                hitableCells.push(cell);
            }
        }
    }
    // console.log("-->", hitableCells.length);
    const number = Math.floor(Math.random() * Math.floor(hitableCells.length));
    return hitableCells[number];
}

function getBiggestAliveShip(playerShips) {
    return playerShips
        .filter(ship => {
            return ship.damage === 0;
        })
        .sort(function (ship1, ship2) {
            return ship2.size - ship1.size;
        })[0];
}

export const getRecommendedShots = (cells, ships) => {
    const biggestAliveShip = getBiggestAliveShip(ships);
    if (!biggestAliveShip) {
        return [];
    }
    const shipSize = biggestAliveShip.size;

    if (shipSize === 1) {
        return [];
    }
    const spaciousRooms = getSpaciousRooms(cells, shipSize, function (cell) {
        return cell.isHit || cell.isKilledShipNeighborCell
    });

    const recommendedRoomShots = spaciousRooms.map(room => {
        return room[Math.floor(room.length / 2)];
    });

    const result = [];
    recommendedRoomShots.forEach(cell => {
        const len = result.filter(c => {
            return c.x === cell.x && c.y === cell.y
        }).length;
        if (len === 0) {
            result.push(cell);
        }
    })
    return result;
}

export const getShot = (cells, ships) => {
    const recommendedShots = getRecommendedShots(cells, ships);
    if (recommendedShots.length === 0) {
        return _getRandomFreeCell(cells);
    }
    return randomElement(recommendedShots);
    /*const biggestAliveShip = getBiggestAliveShip(ships);
    // console.log('biggestAliveShip', biggestAliveShip);

    const shipSize = biggestAliveShip.size;

    if (shipSize === 1) {
        return _getRandomFreeCell(cells);
    }

    const spaciousRooms = getSpaciousRooms(cells, shipSize, function (cell) {
        return cell.isHit || cell.isKilledShipNeighborCell
    });
    // console.log("spaciousRooms", spaciousRooms);
    const randomRoom = randomElement(spaciousRooms);
    // console.log("randomRoom", randomRoom);
    if (!randomRoom || randomRoom.length === 0) {
        return _getRandomFreeCell(cells); // we know all ships, no rooms for the last wan and if is wounded
    }
    return randomRoom[Math.floor(randomRoom.length / 2)];*/
}
