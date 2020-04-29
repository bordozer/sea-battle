import React, {Component} from 'react';

import ShipRoomsCollector from 'src/utils/ship-rooms-collector'
import {getBiggestAliveShip} from 'src/utils/ships-utils'

function populateCommonRoomsCells(map, rooms1, rooms2) {
    rooms1.forEach(room1Cells => {
        room1Cells.forEach(room1Cell => {
            rooms2.forEach(room2Cells => {
                room2Cells.forEach(room2Cell => {
                    if (room1Cell.id === room2Cell.id) {
                        map[room1Cell.id] = {
                            id: room1Cell.id,
                            count: map[room1Cell.id] ? map[room1Cell.id].count + 1 : 0,
                            cell: room1Cell
                        };
                    }
                });
            });
        });
    });
}

function getCells(map) {
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

export default class AiLevel3 extends Component {

    getCells = (cells, ships) => {
        const biggestShipSize = getBiggestAliveShip(ships).size;

        const shipRooms = new ShipRoomsCollector(1).collectRooms(cells, biggestShipSize, function (cell) {
            return !cell.isHit && !cell.isKilledShipNeighborCell
        });
        const hShipRooms = shipRooms.hFreeRooms;
        console.log("hShipRooms", hShipRooms);
        const vShipRooms = shipRooms.vFreeRooms;
        console.log("vShipRooms", vShipRooms);

        const map = {};
        populateCommonRoomsCells(map, hShipRooms, vShipRooms);
        populateCommonRoomsCells(map, hShipRooms, hShipRooms);
        populateCommonRoomsCells(map, vShipRooms, vShipRooms);
        const cellsForShoot = getCells(map);
        console.log("map", map);
        console.log("cellsForShoot", cellsForShoot);
        return cellsForShoot;
    }
}
