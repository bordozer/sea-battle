/* jshint esversion: 6 */

import ShipRoomsCollector from 'src/utils/ship-rooms-collector';
import {getCellsByFilter} from 'src/utils/cells-utils';
import {randomElement, randomInt} from 'src/utils/random-utils';

function initShips() {
    return [
        {id: 11, name: 'Aquila (patrol boat)', size: 1, cells: [], damage: 0},
        {id: 12, name: 'Tornado (patrol boat)', size: 1, cells: [], damage: 0},
        {id: 13, name: 'Pegasus (patrol boat)', size: 1, cells: [], damage: 0},
        {id: 14, name: 'Hercules (patrol boat)', size: 1, cells: [], damage: 0},
        {id: 21, name: 'Annapolis (destroyer)', size: 2, cells: [], damage: 0},
        {id: 22, name: 'St Francis (destroyer)', size: 2, cells: [], damage: 0},
        {id: 31, name: 'Aaron Ward (destroyer)', size: 2, cells: [], damage: 0},
        {id: 32, name: 'Hobart (cruiser)', size: 3, cells: [], damage: 0},
        {id: 33, name: 'Canberra (cruiser)', size: 3, cells: [], damage: 0},
        {id: 41, name: 'Missouri (battleship)', size: 4, cells: [], damage: 0},
        // {id: 51, name: 'Prince of Wales (carrier)', size: 5, cells: [], damage: 0} //Liaoning
    ];
}

function isFreeForShipCell(cell) {
    return !cell.ship && !cell.isShipNeighbor;
}

function setNeighborCellsProperty(cells, cell, property) {
    const cellWithNeighbors = getCellWithNeighbors(cells, cell);
    // console.log("cell", cell);
    // console.log("cellWithNeighbors", cellWithNeighbors);
    cellWithNeighbors.forEach(neighborCell => {
        neighborCell[property] = true;
    });
}

function _getRandomShipRoom(cells, shipSize) {
    if (shipSize === 1) {
        return {
            roomCells: [randomElement(getCellsByFilter(cells, isFreeForShipCell))]
        };
    }
    const spaciousRooms = new ShipRoomsCollector(1).collectRooms(cells, shipSize, isFreeForShipCell);
    // TODO: place a ship at the border. demands AI correction
    if (randomInt(100) < 70) {
        return randomElement([
            spaciousRooms.hFreeRooms[0],
            spaciousRooms.hFreeRooms[spaciousRooms.hFreeRooms.length - 1],
            spaciousRooms.vFreeRooms[0],
            spaciousRooms.vFreeRooms[spaciousRooms.vFreeRooms.length - 1]
        ]);
    }
    return randomElement(spaciousRooms.hFreeRooms.concat(spaciousRooms.vFreeRooms));
}

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
        setNeighborCellsProperty(cells, cell, 'isKilledShipNeighborCell');
    });
};

export const generateShips = (cells) => {
    const ships = initShips();

    ships.reverse().forEach(ship => {
        const shipSize = ship.size;

        const shipRoom = _getRandomShipRoom(cells, shipSize);

        shipRoom.roomCells.forEach(cell => {
            cell.ship = ship;
        });
        shipRoom.roomCells.forEach(cell => {
            setNeighborCellsProperty(cells, cell, 'isShipNeighbor');
        });
    });
    return {
        cells: cells,
        ships: ships
    };
};
