import React from 'react';

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function _getRandomNoShipCell(cells, battleFieldSize) {
    const temp = [];
    for (let x = 0; x < battleFieldSize; x++) {
        for (let y = 0; y < battleFieldSize; y++) {
            if (!cells[x][y].isShip) {
                temp.push(cells[x][y]);
            }
        }
    }
    // console.log("-->", temp.length);
    const number = Math.floor(Math.random() * temp.length);
    return temp[number];
}

export const initBattleField = (size) => {
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

export const generateRandomShips = (battleFieldSize, cellsCount) => {
    const cells = initBattleField(battleFieldSize);
    let shipsCount = cellsCount;
    while (shipsCount > 0) {
        const cell = _getRandomNoShipCell(cells, battleFieldSize);
        cell.isShip = true;
        shipsCount--;
    }
    return cells;
}
