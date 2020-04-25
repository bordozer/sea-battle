import React from 'react';

import _ from "underscore";

import {randomElement, randomInt} from 'src/utils/random-utils'

function _initShips() {
    return [
        {id: 11, name: 'Ship 1.1', size: 1, cells: [], damage: 0},
        {id: 12, name: 'Ship 1.2', size: 1, cells: [], damage: 0},
        {id: 13, name: 'Ship 1.3', size: 1, cells: [], damage: 0},
        {id: 14, name: 'Ship 1.4', size: 1, cells: [], damage: 0},
        {id: 21, name: 'Ship 2.1', size: 2, cells: [], damage: 0},
        {id: 22, name: 'Ship 2.2', size: 2, cells: [], damage: 0},
        {id: 31, name: 'Ship 2.3', size: 2, cells: [], damage: 0},
        {id: 32, name: 'Ship 3.1', size: 3, cells: [], damage: 0},
        {id: 33, name: 'Ship 3.2', size: 3, cells: [], damage: 0},
        {id: 41, name: 'Ship 4.1', size: 4, cells: [], damage: 0}
    ]
}

function _getFreeCells(cells, busyFilter) {
    const battleFieldSize = cells.length;
    const arr = [];
    for (let x = 0; x < battleFieldSize; x++) {
        for (let y = 0; y < battleFieldSize; y++) {
            const cell = cells[x][y];
            if (!busyFilter(cell)) {
                arr.push(cell);
            }
        }
    }
    return arr;
}

function _getVFreeRoomsOfArray(cells, shipSize) {
    const result = [];
    let room = [];
    let offset = 0;
    room.push(cells[0]);

    for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.y === cells[i - 1].y + 1 && room.length < shipSize) {
            room.push(cell);
        } else {
            if (room.length === shipSize) {
                result.push(room);
            }
            room = [];
            i = offset++;
        }
    }
    if (room.length > 0 && room.length === shipSize) {
        result.push(room);
    }

    return result;
}

function _getHFreeRoomsOfArray(cells, shipSize) {
    const result = [];
    let room = [];
    let offset = 0;
    room.push(cells[0]);

    for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.x === cells[i - 1].x + 1 && room.length < shipSize) {
            room.push(cell);
        } else {
            if (room.length === shipSize) {
                result.push(room);
            }
            room = [];
            i = offset++;
        }
    }
    if (room.length > 0 && room.length === shipSize) {
        result.push(room);
    }

    return result;
}

function _getVFreeRooms(cells, shipSize, busyFilter) {
    const result = [];
    const freeCells = _getFreeCells(cells, busyFilter);
    // console.log('freeCells', freeCells);

    const freeCellsMap = _.groupBy(freeCells, function (cell) {
        return cell.x;
    });
    // console.log('freeCellsMap', freeCellsMap);

    Object.keys(freeCellsMap)
        .forEach(column => {
            const columnCells = freeCellsMap[column];
            // console.log('line', column, 'columnCells', columnCells);

            const columnFreeRooms = _getVFreeRoomsOfArray(columnCells, shipSize);
            // console.log('line', column, 'columnFreeRooms', columnFreeRooms);

            columnFreeRooms.forEach(columnFreeRoom => {
                result.push(columnFreeRoom);
            })
        });
    return result;
}

function _getHFreeRooms(cells, shipSize, busyFilter) {
    const result = [];
    const freeCells = _getFreeCells(cells, busyFilter);
    const freeCellsMap = _.groupBy(freeCells, function (cell) {
        return cell.y;
    });
    // console.log('freeCellsMap', freeCellsMap);

    Object.keys(freeCellsMap)
        .forEach(column => {
            const lineCells = freeCellsMap[column];
            // console.log('line', column, 'lineCells', lineCells);

            const lineFreeRooms = _getHFreeRoomsOfArray(lineCells, shipSize);
            // console.log('line', column, 'lineFreeRooms', lineFreeRooms);

            lineFreeRooms.forEach(lineFreeRoom => {
                result.push(lineFreeRoom);
            })
        });
    return result;
}

function _setNeighborCellsProperty(cells, cell, property) {
    getCellWithNeighbors(cells, cell).forEach(neighborCell => {
        neighborCell[property] = true;
    })
}

export const getSpaciousRooms = (cells, shipSize, busyFilter) => {
    const hFreeRooms = _getHFreeRooms(cells, shipSize, busyFilter);
    // console.log("hFreeRooms", hFreeRooms);
    const vFreeRooms = _getVFreeRooms(cells, shipSize, busyFilter);
    // console.log("vFreeRooms", vFreeRooms);
    const freeRooms = hFreeRooms.concat(vFreeRooms);
    return {
        hFreeRooms: hFreeRooms,
        vFreeRooms: vFreeRooms
    }
};

export const getCellWithNeighbors = (cells, cell) => {
    const result = [];
    for (let i = cell.y - 1; i <= cell.y + 1; i++) {
        if (!cells[i]) {
            continue;
        }
        for (let j = cell.x - 1; j <= cell.x + 1; j++) {
            if (i === cell.y && j === cell.x) {
                continue;
            }
            if (cells[i][j]) {
                result.push(cells[i][j]);
            }
        }
    }
    return result;
};

export const markAllShipNeighborCellsAsKilled = (ship, cells) => {
    const cellsWithShip = [];
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[i][j];
            if (cell.ship && cell.ship.id === ship.id) {
                cellsWithShip.push(cell);
            }
        }
    }

    cellsWithShip.forEach(cell => {
        _setNeighborCellsProperty(cells, cell, 'isKilledShipNeighborCell');
    })
};

export const generateShips = (cells) => {
    const ships = _initShips();

    ships.reverse().forEach(ship => {
        const shipSize = ship.size;
        const spaciousRooms = getSpaciousRooms(cells, shipSize, function (cell) {
            return cell.ship || cell.isShipNeighbor;
        });
        /*if (shipSize === 4) {
            console.log("spaciousRooms.vFreeRooms", spaciousRooms.vFreeRooms);
        }*/

        const hvSpaciousRooms = spaciousRooms.hFreeRooms.concat(spaciousRooms.vFreeRooms);
        /*if (shipSize === 4) {
            console.log("hvSpaciousRooms", hvSpaciousRooms);
        }*/
        const randomSpaciousRoom = randomElement(hvSpaciousRooms);
        /*if (randomSpaciousRoom.length < shipSize) {
            console.log("TOO SMALL ROOM");
            console.log("ship", ship);
            console.log("spaciousRooms.hFreeRooms", spaciousRooms.hFreeRooms);
            console.log("spaciousRooms.vFreeRooms", spaciousRooms.vFreeRooms);
            console.log("randomSpaciousRoom", randomSpaciousRoom);
        }*/
        /*if (randomSpaciousRoom.length === 0) {
            console.log("NO SPACIOUS ROOM");
        }*/
        randomSpaciousRoom.forEach(cell => {
            cell.ship = ship;
            _setNeighborCellsProperty(cells, cell, 'isShipNeighbor');
        });
    });
    return {
        cells: cells,
        ships: ships
    };
};
