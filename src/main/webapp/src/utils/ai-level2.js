import React, {Component} from 'react';
import {getBiggestAliveShip} from 'src/utils/ships-utils'
import {getSpaciousRooms} from 'src/utils/ships-generator'

export default class AiLevel2 extends Component {

    getCells = (cells, ships) => {
        const biggestAliveShip = getBiggestAliveShip(ships);
        if (biggestAliveShip.size === 1) {
            return [];
        }
        const shipSize = biggestAliveShip.size;
        if (shipSize === 1) {
            return [];
        }

        const spaciousRooms = getSpaciousRooms(cells, shipSize, function (cell) {
            return !cell.isHit && !cell.isKilledShipNeighborCell
        });
        const hShipRooms = spaciousRooms.hFreeRooms;
        // console.log("hShipRooms", hShipRooms);
        const vShipRooms = spaciousRooms.vFreeRooms;
        // console.log("vShipRooms", vShipRooms);

        const shipRooms = hShipRooms.concat(vShipRooms);

        const roomsMiddleCells = shipRooms.flatMap(room => {
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
