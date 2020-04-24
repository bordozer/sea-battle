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

function isHittableCell(cell) {
    return cell && !cell.isKilledShipNeighborCell && !cell.isHit;
}

function _shotOnceWoundedShipAgain(cells, woundedCell) {
    console.log("_shotOnceWoundedShipAgain", woundedCell);
    const neighborCells = [];

    if (cells[woundedCell.y - 1] && cells[woundedCell.y][woundedCell.x]) {
        neighborCells.push(cells[woundedCell.y - 1][woundedCell.x]);
    }
    if (cells[woundedCell.y + 1] && cells[woundedCell.y][woundedCell.x]) {
        neighborCells.push(cells[woundedCell.y + 1][woundedCell.x]);
    }
    if (cells[woundedCell.y] && cells[woundedCell.y][woundedCell.x - 1]) {
        neighborCells.push(cells[woundedCell.y][woundedCell.x - 1]);
    }
    if (cells[woundedCell.y] && cells[woundedCell.y][woundedCell.x + 1]) {
        neighborCells.push(cells[woundedCell.y][woundedCell.x + 1]);
    }

    const hittableNeighborCells = neighborCells.filter(cell => {
        return isHittableCell(cell);
    });
    return randomElement(hittableNeighborCells);
}

function finishingOffWoundedShip(cells, playerWoundedShipCells) {
    if (playerWoundedShipCells.length === 1) {
        return _shotOnceWoundedShipAgain(cells, playerWoundedShipCells[0]);
    }

    console.log("finishingOffWoundedShip", playerWoundedShipCells.length, 'cells');
    let firstWoundedCell = playerWoundedShipCells[0];
    let lastWoundedCell = playerWoundedShipCells[playerWoundedShipCells.length - 1];
    const isVerticalShip = firstWoundedCell.x === lastWoundedCell.x;
    if (isVerticalShip) {
        const sorted = playerWoundedShipCells.sort(function (cell1, cell2) {
            return cell1.y - cell2.y;
        });
        firstWoundedCell = sorted[0];
        lastWoundedCell = sorted[sorted.length - 1];
        const targets = [
            cells[firstWoundedCell.y - 1][firstWoundedCell.x],
            cells[lastWoundedCell.y + 1][lastWoundedCell.x]
        ];
        return randomElement(targets.filter(cell => {
            return isHittableCell(cell);
        }));
    }

    // horizontal ship
    const sorted = playerWoundedShipCells.sort(function (cell1, cell2) {
        return cell1.x - cell2.x;
    });
    firstWoundedCell = sorted[0];
    lastWoundedCell = sorted[sorted.length - 1];
    const targets = [
        cells[firstWoundedCell.y][firstWoundedCell.x - 1],
        cells[lastWoundedCell.y][lastWoundedCell.x + 1]
    ];
    return randomElement(targets.filter(cell => {
        return isHittableCell(cell);
    }));
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
    });
    return result;
};

export const getEnemyShot = (cells, ships, playerWoundedShipCells) => {
    // console.log("Player's wounded ship cells", playerWoundedShipCells);
    if (playerWoundedShipCells.length > 0) {
        // console.log("WOUNDED", playerWoundedShipCells.length, 'cells');
        return finishingOffWoundedShip(cells, playerWoundedShipCells);
    }

    const recommendedShots = getRecommendedShots(cells, ships);
    if (recommendedShots.length === 0) {
        return _getRandomFreeCell(cells);
    }
    return randomElement(recommendedShots);
}
