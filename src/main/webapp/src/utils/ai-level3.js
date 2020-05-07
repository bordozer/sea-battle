/* jshint esversion: 6 */
import React, {Component} from 'react';

import ShipRoomsCollector from 'src/utils/ship-rooms-collector';
import {getBiggestAliveShip} from 'src/utils/ships-utils';

function populateCommonRoomsCells(rooms) {

    const hiddenCells = rooms.flatMap(room => room.roomCells);
    // console.log("hiddenCells", hiddenCells);

    const map = {};
    hiddenCells.forEach(cell => {
        let count = 0;
        rooms.forEach(room => {
            room.roomCells.forEach(roomCell => {
                if (roomCell.id === cell.id) {
                    count++;
                }
            });
        });
        map[cell.id] = {
            id: cell.id,
            count: count,
            cell: cell
        };
        count = 0;
    });
    return map;
}

function getCells(map) {
    let commonCells = [];
    let max = 0;
    Object.keys(map)
        .forEach(cellId => {
            if (map[cellId].count === max) {
                commonCells.push(map[cellId].cell);
            }
            if (map[cellId].count > max) {
                max = map[cellId].count;
                commonCells = [];
                commonCells.push(map[cellId].cell);
            }
        });
    return commonCells;
}

export default class AiLevel3 extends Component {

    getCells = (cells, ships) => {
        const biggestShipSize = getBiggestAliveShip(ships).size;

        const shipRooms = new ShipRoomsCollector(1).collectRooms(cells, biggestShipSize, function (cell) {
            return !cell.isHit && !cell.isKilledShipNeighborCell;
        });
        const hShipRooms = shipRooms.hFreeRooms;
        // console.log("hShipRooms", hShipRooms);
        const vShipRooms = shipRooms.vFreeRooms;
        // console.log("vShipRooms", vShipRooms);

        const map = populateCommonRoomsCells(hShipRooms.concat(vShipRooms));
        return getCells(map);
    }
}
