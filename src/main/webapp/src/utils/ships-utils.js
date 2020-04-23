import React from 'react';

import _ from "underscore";

import {randomBoolean, randomElement, randomInt} from 'src/utils/random-utils'

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

function _getFreeCells(cells) {
    const battleFieldSize = cells.length;
    const arr = []
    for (let x = 0; x < battleFieldSize; x++) {
        for (let y = 0; y < battleFieldSize; y++) {
            const cell = cells[x][y];
            if (!cell.ship && !cell.isShipNeighbor) {
                arr.push(cell);
            }
        }
    }
    return arr;
}

function _getVFreeRoomsOfArray(cells) {
    const result = [];
    let temp = [];
    let column = cells[0].y;

    for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.y === column + 1) {
            temp.push(cell);
            column++;
        } else {
            column = cell.y;
            result.push(temp);
            temp = [];
        }
    }
    if (temp.length > 0) {
        result.push(temp);
    }

    return result;
}

function _getHFreeRoomsOfArray(cells) {
    const result = [];
    let temp = [];

    let line = cells[0].x;

    for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.x === line + 1) {
            temp.push(cell);
            line++;
        } else {
            line = cell.x;
            result.push(temp);
            temp = [];
        }
    }
    if (temp.length > 0) {
        result.push(temp);
    }

    return result;
}

function _getVFreeRooms(cells) {
    const result = [];
    const freeCells = _getFreeCells(cells);
    // console.log('freeCells', freeCells);

    const freeCellsMap = _.groupBy(freeCells, function (cell) {
        return cell.x;
    });
    // console.log('freeCellsMap', freeCellsMap);

    Object.keys(freeCellsMap)
        .forEach(column => {
            const columnCells = freeCellsMap[column];
            // console.log('line', column, 'columnCells', columnCells);

            const columnFreeRooms = _getVFreeRoomsOfArray(columnCells);
            // console.log('line', column, 'columnFreeRooms', columnFreeRooms);

            columnFreeRooms.forEach(columnFreeRoom => {
                result.push(columnFreeRoom);
            })
        });
    return result;
}

function _getHFreeRooms(cells) {
    const result = [];
    const freeCells = _getFreeCells(cells);
    const freeCellsMap = _.groupBy(freeCells, function (cell) {
        return cell.y;
    });
    // console.log('freeCellsMap', freeCellsMap);

    Object.keys(freeCellsMap)
        .forEach(column => {
            const lineCells = freeCellsMap[column];
            // console.log('line', column, 'lineCells', lineCells);

            const lineFreeRooms = _getHFreeRoomsOfArray(lineCells);
            // console.log('line', column, 'lineFreeRooms', lineFreeRooms);

            lineFreeRooms.forEach(lineFreeRoom => {
                result.push(lineFreeRoom);
            })
        });
    return result;
}

function _setNeighborCellsProperty (cells, cell, property) {
    for (let i = cell.y - 1; i <= cell.y + 1; i++) {
        if (!cells[i]) {
            continue;
        }
        for (let j = cell.x - 1; j <= cell.x + 1; j++) {
            if (cells[i][j]) {
                const neighborCell = cells[i][j];
                neighborCell[property] = true;
            }
        }
    }
}

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
}

export const generateShips = (cells) => {
    const ships = _initShips();
    ships.reverse().forEach(ship => {
        const shipSize = ship.size;
        const placementStrategy = randomBoolean() ? _getHFreeRooms : _getVFreeRooms;
        const freeRooms = placementStrategy(cells);
        // console.log('freeRooms', freeRooms);

        const spaciousRooms = freeRooms.filter(room => {
            return room.length >= shipSize;
        })
        if (spaciousRooms.length === 0) {
            generateShips();
        }
        // console.log('spaciousRooms', spaciousRooms);

        const randomSpaciousRoom = randomElement(spaciousRooms);
        // console.log("randomSpaciousRoom", randomSpaciousRoom);

        const maxOffset = randomSpaciousRoom.length - shipSize;
        // console.log("maxOffset", maxOffset);

        const shipStartIndex = randomInt(maxOffset);
        // console.log("shipStartIndex", shipStartIndex);
        // console.log("ship is going to be at ", shipStartIndex + '-' + (shipStartIndex + shipSize));

        for (let i = shipStartIndex; i < shipStartIndex + shipSize; i++) {
            const cell = randomSpaciousRoom[i];
            cell.ship = ship;
            _setNeighborCellsProperty(cells, cell, 'isShipNeighbor');
        }
    })
    return cells;
}
