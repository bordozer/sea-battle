import React from 'react';

const SHIPS = [
    {name: 'Ship 1.1', size: 1},
    {name: 'Ship 1.2', size: 1},
    {name: 'Ship 1.3', size: 1},
    {name: 'Ship 1.4', size: 1},
    {name: 'Ship 2.1', size: 2},
    {name: 'Ship 2.2', size: 2},
    {name: 'Ship 2.3', size: 2},
    {name: 'Ship 3.1', size: 3},
    {name: 'Ship 3.2', size: 3},
    {name: 'Ship 4.1', size: 4},
]

function _getRandomNoShipCell(cells) {
    const battleFieldSize = cells.length;
    const temp = [];
    for (let x = 0; x < battleFieldSize; x++) {
        for (let y = 0; y < battleFieldSize; y++) {
            if (!cells[x][y].isShip) {
                temp.push(cells[x][y]);
            }
        }
    }
    const number = Math.floor(Math.random() * temp.length);
    return temp[number];
}

export const generateShips = (cells, cellsLimit) => {
    let shipsCount = cellsLimit;
    while (shipsCount > 0) {
        const cell = _getRandomNoShipCell(cells);
        cell.isShip = true;
        shipsCount--;
    }
    return cells;
}
