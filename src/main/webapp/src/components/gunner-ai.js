import React from 'react';

import {getSpaciousRooms, getCellWithNeighbors} from 'src/utils/ships-utils'
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

function isShotWoundedShip(cell) {
    return cell && cell.ship && cell.ship.damage < cell.ship.size;
}

function finishingOffWoundedShip(cells, lastShotCell) {
    // console.log("lastShotCell", finishingOffWoundedShip);
    const cellWithNeighbors = getCellWithNeighbors(cells, lastShotCell);

    // if (woundedShip.damage === 1) {
        const targets = cellWithNeighbors.filter(neighborCell => {
            return !neighborCell.isHit && !neighborCell.isKilledShipNeighborCell;
        });
        return randomElement(targets);
    // }
    // return {};
}

export const getRecommendedShots = (cells, ships, lastShotCell) => {
    if (isShotWoundedShip(lastShotCell)) {
        return [];
    }
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

    const recommendedRoomShots = spaciousRooms.flatMap(room => {
        const times = Math.floor(room.length / shipSize);
        if (times > 1) {
            const tmp = [];
            for (let i = shipSize - 1; i < room.length; i += shipSize - 1) {
                tmp.push(room[i]);
            }
            return tmp;
        }
        return room[Math.floor(room.length / 2)];
    });
    // console.log("recommendedRoomShots", recommendedRoomShots);

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

export const getShot = (cells, ships, lastShotCell) => {
    console.log("ENEMY last shot", lastShotCell);
    if (isShotWoundedShip(lastShotCell)) {
        console.log("WOUNDED");
        return finishingOffWoundedShip(cells, lastShotCell);
    }

    const recommendedShots = getRecommendedShots(cells, ships, lastShotCell);
    if (recommendedShots.length === 0) {
        return _getRandomFreeCell(cells);
    }
    return randomElement(recommendedShots);
}
