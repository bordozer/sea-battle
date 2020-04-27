import React from 'react';

import _ from "underscore";

import {getCellsByFilter} from 'src/utils/cells-utils'
import {randomElement} from 'src/utils/random-utils'

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

function isFreeForShipCell(cell) {
    return !cell.ship && !cell.isShipNeighbor;
}

function _getVFreeRoomsOfArray(cells, shipSize, filter) {
    const result = [];

    for (let i = 0; i <= cells.length - shipSize; i++) {
        const room = cells.slice(i, i + shipSize);
        if (room.length < shipSize) {
            break;
        }
        let isRoom = true;
        for (let j = 0; j < room.length - 1; j++) {
            if (filter(room, j)) {
                isRoom = false;
                break;
            }
        }
        if (isRoom) {
            result.push(room);
        }
    }
    // debugger;
    return result;
}

function _getVFreeRooms(cells, shipSize, filter) {
    let result = [];
    const freeCells = getCellsByFilter(cells, filter);
    // console.log('_getVFreeRooms freeCells', freeCells);

    const freeCellsMap = _.groupBy(freeCells, function (cell) {
        return cell.x;
    });
    // console.log('freeCellsMap', freeCellsMap);

    Object.keys(freeCellsMap)
        .forEach(column => {
            const columnCells = freeCellsMap[column];
            // console.log('line', column, 'columnCells', columnCells);

            const freeRooms = _getVFreeRoomsOfArray(columnCells, shipSize, function(room, j) {
                return room[j].y + 1 !== room[j + 1].y;
            });
            // console.log('line', column, 'v freeRooms', freeRooms);

            if (freeRooms.length > 0) {
                result = result.concat(freeRooms);
            }
        });
    return result;
}

function _getHFreeRooms(cells, shipSize, filter) {
    let result = [];
    const freeCells = getCellsByFilter(cells, filter);
    // console.log('_getHFreeRooms freeCells', freeCells);
    const freeCellsMap = _.groupBy(freeCells, function (cell) {
        return cell.y;
    });
    // console.log('freeCellsMap', freeCellsMap);

    Object.keys(freeCellsMap)
        .forEach(column => {
            const lineCells = freeCellsMap[column];
            // console.log('line', column, 'lineCells', lineCells);

            const freeRooms = _getVFreeRoomsOfArray(lineCells, shipSize, function(room, j) {
                return room[j].x + 1 !== room[j + 1].x;
            });
            // console.log('line', column, 'h freeRooms', freeRooms);

            if (freeRooms.length > 0) {
                result = result.concat(freeRooms);
            }
        });
    return result;
}

function _setNeighborCellsProperty(cells, cell, property) {
    const cellWithNeighbors = getCellWithNeighbors(cells, cell);
    // console.log("cell", cell);
    // console.log("cellWithNeighbors", cellWithNeighbors);
    cellWithNeighbors.forEach(neighborCell => {
        neighborCell[property] = true;
    })
}

export const getSpaciousRooms = (cells, shipSize, filter) => {
    const hFreeRooms = _getHFreeRooms(cells, shipSize, filter);
    // console.log("hFreeRooms", hFreeRooms);
    const vFreeRooms = _getVFreeRooms(cells, shipSize, filter);
    // console.log("vFreeRooms", vFreeRooms);
    const freeRooms = hFreeRooms.concat(vFreeRooms);
    return {
        hFreeRooms: hFreeRooms,
        vFreeRooms: vFreeRooms
    }
};

export const getCellWithNeighbors = (cells, shipCell) => {
    const result = [];
    for (let y = shipCell.y - 1; y <= shipCell.y + 1; y++) {
        if (!cells[y]) {
            continue;
        }
        for (let x = shipCell.x - 1; x <= shipCell.x + 1; x++) {
            const neighborCell = cells[y][x];
            if (neighborCell && !neighborCell.ship) {
                // console.log("cells[y][x]", neighborCell);
                result.push(neighborCell);
            }
        }
    }
    return result;
};

export const markAllShipNeighborCellsAsKilled = (ship, cells) => {
    const killedShipCells = [];
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[i][j];
            if (cell.ship && cell.ship.id === ship.id) {
                killedShipCells.push(cell);
            }
        }
    }

    killedShipCells.forEach(cell => {
        _setNeighborCellsProperty(cells, cell, 'isKilledShipNeighborCell');
    })
};

export const generateShips = (cells) => {
    const ships = _initShips();

    ships.reverse().forEach(ship => {
        const shipSize = ship.size;

        const spaciousRooms = getSpaciousRooms(cells, shipSize, isFreeForShipCell);
        const hvSpaciousRooms = spaciousRooms.hFreeRooms.concat(spaciousRooms.vFreeRooms);
        const shipRoom = randomElement(hvSpaciousRooms);

        shipRoom.forEach(cell => {
            cell.ship = ship;
        });
        shipRoom.forEach(cell => {
            _setNeighborCellsProperty(cells, cell, 'isShipNeighbor');
        });
    });
    return {
        cells: cells,
        ships: ships
    };
};
