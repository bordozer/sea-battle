import React from 'react';

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

export const generate = (cells, battleFieldSize, cellsCount) =>  {
    let shipsCount = cellsCount;
    while (shipsCount > 0) {
        const cell = _getRandomNoShipCell(cells, battleFieldSize);
        cell.isShip = true;
        shipsCount--;
    }
    return cells;
}
