import React, {Component} from 'react';

import {getSpaciousRooms} from 'src/utils/ships-generator'
import {getBiggestAliveShip} from 'src/utils/ships-utils'

function getCrossRoomsShoots(hFreeRooms, vFreeRooms) {
    const map = {};
    hFreeRooms.forEach(hRoomCells => {
        hRoomCells.forEach(hRoomCell => {
            vFreeRooms.forEach(vRoomCells => {
                vRoomCells.forEach(vRoomCell => {
                    if (hRoomCell.id === vRoomCell.id) {
                        map[hRoomCell.id] = {
                            id: hRoomCell.id,
                            count: map[hRoomCell.id] ? map[hRoomCell.id].count + 1 : 0,
                            cell: hRoomCell
                        }
                    }
                });
            });
        });
    });
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
        const hFreeRooms = spaciousRooms.hFreeRooms;
        // console.log("hFreeRooms", hFreeRooms);
        const vFreeRooms = spaciousRooms.vFreeRooms;
        // console.log("vFreeRooms", vFreeRooms);

        const commonCells = getCrossRoomsShoots(hFreeRooms, vFreeRooms);
        if (commonCells.length > 0) {
            // console.log("commonCells", commonCells);
            return commonCells;
        }
    }
}
