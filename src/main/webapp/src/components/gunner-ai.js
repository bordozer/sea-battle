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

function isShotWoundedShip(cell) {
    return cell && cell.ship && cell.ship.damage < cell.ship.size;
}

function finishingOffWoundedShip(cells, lastShotCell) {
    const neighborCells = [];
    if (cells[lastShotCell.y - 1] && cells[lastShotCell.y][lastShotCell.x]) {
        neighborCells.push(cells[lastShotCell.y - 1][lastShotCell.x]);
    }
    if (cells[lastShotCell.y + 1] && cells[lastShotCell.y][lastShotCell.x]) {
        neighborCells.push(cells[lastShotCell.y + 1][lastShotCell.x]);
    }
    if (cells[lastShotCell.y] && cells[lastShotCell.y][lastShotCell.x - 1]) {
        neighborCells.push(cells[lastShotCell.y][lastShotCell.x - 1]);
    }
    if (cells[lastShotCell.y] && cells[lastShotCell.y][lastShotCell.x + 1]) {
        neighborCells.push(cells[lastShotCell.y][lastShotCell.x + 1]);
    }

    const hittableNeighborCells = neighborCells.filter(cell => {
        return !cell.isKilledShipNeighborCell;
    });

    if (lastShotCell.ship.damage === 1) {
        return randomElement(hittableNeighborCells.filter(cell => {
            return !cell.isHit;
        }));
    }

    hittableNeighborCells.filter(cell => {
        return cell.ship && !cell.isHit;
    })
    return randomElement(hittableNeighborCells);
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
