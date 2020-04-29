import React, {Component} from 'react';

import {getCellsByFilter} from 'src/utils/cells-utils'
import _ from "underscore";

export default class ShipRoomsCollector extends Component {

    constructor(shipSize) {
        super(shipSize);

        this.state = {
            step: shipSize
        };
    }

    _collectArrayRooms = (cells, shipSize, prefix, filter) => {
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
                result.push({
                    roomId: prefix + '_' + room[0].id + '_' + room[room.length - 1].id,
                    roomCells: room
                });
                i += this.state.step - 1;
            }
        }
        // debugger;
        return result;
    }

    _getVFreeRooms = (cells, shipSize, filter) => {
        let result = [];
        const freeCells = getCellsByFilter(cells, filter);
        // console.log('_getVFreeRooms freeCells', freeCells);

        const freeCellsMap = _.groupBy(freeCells, function (cell) {
            return cell.x;
        });
        // console.log('freeCellsMap', freeCellsMap);

        Object.keys(freeCellsMap)
            .forEach(column => {
                const arrayCells = freeCellsMap[column];
                // console.log('line', column, 'arrayCells', arrayCells);

                const rooms = this._collectArrayRooms(arrayCells, shipSize, 'V', function (room, j) {
                    return room[j].y + 1 !== room[j + 1].y;
                });
                // console.log('line', column, 'v rooms', rooms);

                if (rooms.length > 0) {
                    result = result.concat(rooms);
                }
            });
        return result;
    }

    _getHFreeRooms = (cells, shipSize, filter) => {
        let result = [];
        const freeCells = getCellsByFilter(cells, filter);
        const freeCellsMap = _.groupBy(freeCells, function (cell) {
            return cell.y;
        });
        // console.log('freeCellsMap', freeCellsMap);

        Object.keys(freeCellsMap)
            .forEach(column => {
                const arrayCells = freeCellsMap[column];
                // console.log('line', column, 'arrayCells', arrayCells);

                const rooms = this._collectArrayRooms(arrayCells, shipSize, 'H', function (room, j) {
                    return room[j].x + 1 !== room[j + 1].x;
                });
                // console.log('line', column, 'h rooms', rooms);

                if (rooms.length > 0) {
                    result = result.concat(rooms);
                }
            });
        return result;
    }

    collectRooms = (cells, shipSize, filter) => {
        const hFreeRooms = this._getHFreeRooms(cells, shipSize, filter);
        console.log("hFreeRooms", hFreeRooms);
        const vFreeRooms = this._getVFreeRooms(cells, shipSize, filter);
        console.log("vFreeRooms", vFreeRooms);
        const freeRooms = hFreeRooms.concat(vFreeRooms);
        return {
            hFreeRooms: hFreeRooms,
            vFreeRooms: vFreeRooms
        }
    }
}
