import React, {Component} from 'react';

import {getCellsByFilter} from 'src/utils/cells-utils'
import _ from "underscore";

function _getVFreeRoomsOfArray(cells, shipSize, filter) {
    const result = [];

    for (let i = 0; i <= cells.length - shipSize; i++) { // i += shipSize
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

            const freeRooms = _getVFreeRoomsOfArray(columnCells, shipSize, function (room, j) {
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

            const freeRooms = _getVFreeRoomsOfArray(lineCells, shipSize, function (room, j) {
                return room[j].x + 1 !== room[j + 1].x;
            });
            // console.log('line', column, 'h freeRooms', freeRooms);

            if (freeRooms.length > 0) {
                result = result.concat(freeRooms);
            }
        });
    return result;
}

export default class ShipRoomsCollector extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            step: props
        };
    }

    collectRooms = (cells, shipSize, filter) => {
        const hFreeRooms = _getHFreeRooms(cells, shipSize, filter);
        // console.log("hFreeRooms", hFreeRooms);
        const vFreeRooms = _getVFreeRooms(cells, shipSize, filter);
        // console.log("vFreeRooms", vFreeRooms);
        const freeRooms = hFreeRooms.concat(vFreeRooms);
        return {
            hFreeRooms: hFreeRooms,
            vFreeRooms: vFreeRooms
        }
    }
}