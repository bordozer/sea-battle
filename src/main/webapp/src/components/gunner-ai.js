import React from 'react';

import {getSpaciousRooms} from 'src/utils/ships-generator'
import {getBiggestAliveShip} from 'src/utils/ships-utils'
import {randomElement} from 'src/utils/random-utils'

const FIRST_RANDOM_SHOOTS_COUNT = 10;
const NO_STRATEGY = {
    shoots: [],
    strategy: 'no-strategy'
};

function _getRandomFreeCell(cells) {
    const hittableCells = [];
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells.length; y++) {
            const cell = cells[x][y];
            if (!cell.isHit && !cell.isKilledShipNeighborCell) {
                hittableCells.push(cell);
            }
        }
    }
    // console.log("-->", hittableCells.length);
    const number = Math.floor(Math.random() * Math.floor(hittableCells.length));
    return hittableCells[number];
}

function isHittableCell(cell) {
    return cell && !cell.isKilledShipNeighborCell && !cell.isHit;
}

function _shotOnceWoundedShipAgain(cells, woundedCell) {
    // console.log("_shotOnceWoundedShipAgain", woundedCell);
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

    // console.log("finishingOffWoundedShip", playerWoundedShipCells.length, 'cells');
    let firstWoundedCell = playerWoundedShipCells[0];
    let lastWoundedCell = playerWoundedShipCells[playerWoundedShipCells.length - 1];
    const isVerticalShip = firstWoundedCell.x === lastWoundedCell.x;
    if (isVerticalShip) {
        const sorted = playerWoundedShipCells.sort(function (cell1, cell2) {
            return cell1.y - cell2.y;
        });
        firstWoundedCell = sorted[0];
        lastWoundedCell = sorted[sorted.length - 1];
        const targets = [];
        if (cells[firstWoundedCell.y - 1]) {
            targets.push(cells[firstWoundedCell.y - 1][firstWoundedCell.x]);
        }
        if (cells[lastWoundedCell.y + 1]) {
            targets.push(cells[lastWoundedCell.y + 1][lastWoundedCell.x]);
        }
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

function getCrossRoomsShoots(hFreeRooms, vFreeRooms) {
    const map = {};
    hFreeRooms.forEach(hRoomCells => {
        hRoomCells.forEach(hRoomCell => {
            vFreeRooms.forEach(vRoomCells => {
                vRoomCells.forEach(vRoomCell => {
                    if (hRoomCell.id === vRoomCell.id) {
                        map[hRoomCell.id] = {
                            id: hRoomCell.id,
                            count: map[hRoomCell.id] ? map[hRoomCell.id].count + 1 : 0,
                            cell: hRoomCell
                        }
                    }
                });
            });
        });
    });
    // console.log("map", map);
    let commonCells = [];
    let max = 0;
    Object.keys(map)
        .forEach(cellId => {
            if (map[cellId].count > max) {
                max = map[cellId].count;
                commonCells = [];
                commonCells.push(map[cellId].cell);
            }
            if (map[cellId].count === max) {
                commonCells.push(map[cellId].cell);
            }
        });
    return commonCells;
}

export const getRecommendedShots = (cells, ships, difficultyLevel, who) => {
    if (difficultyLevel === 1) {
        return NO_STRATEGY;
    }

    const biggestAliveShip = getBiggestAliveShip(ships);
    if (!biggestAliveShip) {
        return NO_STRATEGY;
    }

    const shipSize = biggestAliveShip.size;
    if (shipSize === 1) {
        return NO_STRATEGY;
    }

    if (_getUnhittableCellsCount(cells) < FIRST_RANDOM_SHOOTS_COUNT) {
        return NO_STRATEGY;
    }

    const spaciousRooms = getSpaciousRooms(cells, shipSize, function (cell) {
        return !cell.isHit && !cell.isKilledShipNeighborCell
    });
    const hFreeRooms = spaciousRooms.hFreeRooms;
    // console.log("hFreeRooms", hFreeRooms);
    const vFreeRooms = spaciousRooms.vFreeRooms;
    // console.log("vFreeRooms", vFreeRooms);

    let commonCells = [];
    if (difficultyLevel === 3) {
        commonCells = getCrossRoomsShoots(hFreeRooms, vFreeRooms);
    }
    if (commonCells.length > 0) {
        // console.log("commonCells", commonCells);
        return {
            shoots: commonCells,
            strategy: 'commons-room-cells'
        };
    }

    const hvSpaciousRooms = hFreeRooms.concat(vFreeRooms);

    const recommendedRoomShots = hvSpaciousRooms.flatMap(room => {
        const times = Math.floor(room.length / shipSize);
        if (times > 1) {
            const tmp = [];
            for (let i = shipSize - 1; i < room.length; i += shipSize) {
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
    // console.log("recommendedRoomShots", result);
    return {
        shoots: result,
        strategy: 'room-middle-cells'
    };
};

function _getUnhittableCellsCount(cells) {
    let result = 0;
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[i][j];
            if (cell.isHit || cell.isKilledShipNeighborCell) {
                result++;
            }
        }
    }
    return result;
}

export const getEnemyShot = (cells, ships, playerWoundedShipCells, difficultyLevel) => {
    // console.log("Player's wounded ship cells", cells);
    if (playerWoundedShipCells.length > 0) {
        // console.log("WOUNDED", playerWoundedShipCells.length, 'cells');
        return finishingOffWoundedShip(cells, playerWoundedShipCells);
    }

    if (difficultyLevel === 1 || _getUnhittableCellsCount(cells) < FIRST_RANDOM_SHOOTS_COUNT) {
        // console.log("random shot 1");
        return _getRandomFreeCell(cells);
    }

    const recommendedShots = getRecommendedShots(cells, ships, difficultyLevel, 'enemy').shoots;
    if (recommendedShots.length !== 0) {
        // console.log("recommendedShots");
        return randomElement(recommendedShots);
    }
    // console.log("random shot 1");
    return _getRandomFreeCell(cells);
};
