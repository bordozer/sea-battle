import React from 'react';

import _ from "underscore";

import {randomElement, randomInt} from 'src/utils/random-utils'

function _initShips() {
    return [
        {name: 'Ship 1.1', size: 1, cells: [], damage: 0},
        {name: 'Ship 1.2', size: 1, cells: [], damage: 0},
        {name: 'Ship 1.3', size: 1, cells: [], damage: 0},
        {name: 'Ship 1.4', size: 1, cells: [], damage: 0},
        // {name: 'Ship 2.1', size: 2, cells: [], damage: 0},
        // {name: 'Ship 2.2', size: 2, cells: [], damage: 0},
        // {name: 'Ship 2.3', size: 2, cells: [], damage: 0},
        // {name: 'Ship 3.1', size: 3, cells: [], damage: 0},
        // {name: 'Ship 3.2', size: 3, cells: [], damage: 0},
        // {name: 'Ship 4.1', size: 4, cells: [], damage: 0}
    ]
}

function _getFreeCells(cells) {
    const battleFieldSize = cells.length;
    const arr = []
    for (let x = 0; x < battleFieldSize; x++) {
        for (let y = 0; y < battleFieldSize; y++) {
            const cell = cells[x][y];
            if (!cell.isShip && !cell.isBusy) {
                arr.push(cell);
            }
        }
    }
    return arr;
}

function _getFreeRooms(cells) {
    const result = [];

    let temp = [];
    let column = cells[0].y;

    for (let col = 1; col < cells.length; col++) {
        const cell = cells[col];
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
    // console.log("_getFreeRooms", result);
    return result;
}

function _hPlacementStrategy(shipSize, cells) {
    const freeRooms = [];
    const freeCells = _getFreeCells(cells);
    // console.log('freeCells', freeCells);

    const freeCellsMap = _.groupBy(freeCells, function (cell) {
        return cell.x;
    });
    // console.log('freeCellsMap', freeCellsMap);

    Object.keys(freeCellsMap)
        .forEach(column => {
            const lineCells = freeCellsMap[column];
            // console.log('line', column, 'lineCells', lineCells);

            const lineFreeRooms = _getFreeRooms(lineCells);
            // console.log('line', column, 'lineFreeRooms', lineFreeRooms);

            lineFreeRooms.forEach(lineFreeRoom => {
                freeRooms.push(lineFreeRoom);
            })
        });
    return freeRooms;
}

function _vPlacementStrategy(shipSize, cells) {
    const result = _getFreeCells(cells);
    // console.log('=>', result);
    return result;
}

export const markNeighborCellsAsBusy = (cells, cell) => {
    for (let i = cell.y - 1; i <= cell.y + 1; i++) {
        for (let j = cell.x - 1; j <= cell.x + 1; j++) {
            if (! cells[i]) {
                continue;
            }
            if (cells[i][j]) {
                cells[i][j].isBusy = true;
            }
        }
    }
}

export const generateShips = (cells) => {
    const ships = _initShips();
    ships.forEach(ship => {
        const shipSize = ship.size;
        // const placement = randomBoolean() ? _hPlacementStrategy: _vPlacementStrategy;
        // placement(shipSize, cells);
        const freeRooms = _hPlacementStrategy(shipSize, cells);
        // console.log('freeRooms', freeRooms);

        const spaciousRooms = freeRooms.filter(room => {
            return room.length >= shipSize;
        })
        // console.log('spaciousRooms', spaciousRooms);

        const randomRoom = randomElement(spaciousRooms);
        // console.log("randomRoom", randomRoom);

        const maxOffset = randomRoom.length - shipSize;
        // console.log("maxOffset", maxOffset);

        const shipStartIndex = randomInt(maxOffset);
        // console.log("shipStartIndex", shipStartIndex);
        // console.log("ship is going to be at ", shipStartIndex + '-' + (shipStartIndex + shipSize));

        for (let i = shipStartIndex; i < shipStartIndex + shipSize; i++) {
            const cell = randomRoom[i];
            cell.isShip = true;
            cell.ship = ship;
            markNeighborCellsAsBusy(cells, cell);
        }
    })
    return cells;
}
