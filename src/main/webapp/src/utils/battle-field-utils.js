import React from 'react';

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

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
                isBusy: false,
                isHit: false
            };
        }
    }
    return cells;
}
