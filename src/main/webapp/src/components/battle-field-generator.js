import React from 'react';

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
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

export const initBattleFieldCells = (size) => {
    const cells = [];
    for (let h = size - 1; h >= 0; h--) {
        cells[h] = [];
        for (let v = size - 1; v >= 0; v--) {
            cells[h][v] = {
                x: v,
                y: h,
                xLabel: X_AXE[v],
                yLabel: h + 1,
                isShip: false,
                isHit: false
            };
        }
    }
    return cells;
}

export const generateShips = (cells, cellsCount) => {
    let shipsCount = cellsCount;
    while (shipsCount > 0) {
        const cell = _getRandomNoShipCell(cells);
        cell.isShip = true;
        shipsCount--;
    }
    return cells;
}
