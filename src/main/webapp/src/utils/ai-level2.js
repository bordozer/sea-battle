import React, {Component} from 'react';

import ShipRoomsCollector from 'src/utils/ship-rooms-collector'
import {getBiggestAliveShip} from 'src/utils/ships-utils'

export default class AiLevel2 extends Component {

    getCells = (cells, ships) => {
        const biggestShipSize = getBiggestAliveShip(ships).size;

        const spaciousRooms = new ShipRoomsCollector().collectRooms(cells, biggestShipSize, function (cell) {
            return !cell.isHit && !cell.isKilledShipNeighborCell
        });
        const hShipRooms = spaciousRooms.hFreeRooms;
        // console.log("hShipRooms", hShipRooms);
        const vShipRooms = spaciousRooms.vFreeRooms;
        // console.log("vShipRooms", vShipRooms);

        const shipRooms = hShipRooms.concat(vShipRooms);

        const roomsMiddleCells = shipRooms.flatMap(room => {
            const times = Math.floor(room.length / biggestShipSize);
            if (times > 1) {
                const tmp = [];
                for (let i = biggestShipSize - 1; i < room.length; i += biggestShipSize) {
                    tmp.push(room[i]);
                }
                return tmp;
            }
            return room[Math.floor(room.length / 2)];
        });
        // console.log("roomsMiddleCells", roomsMiddleCells);

        // filter out duplicates
        const result = [];
        roomsMiddleCells.forEach(cell => {
            const len = result.filter(c => {
                return c.x === cell.x && c.y === cell.y
            }).length;
            if (len === 0) {
                result.push(cell);
            }
        });

        return result;
    }
}
