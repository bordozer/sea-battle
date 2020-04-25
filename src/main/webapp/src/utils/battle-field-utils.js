import React from 'react';

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const initBattleFieldCells = (size) => {
    const cells = [];
    for (let h = size - 1; h >= 0; h--) {
        cells[h] = [];
        for (let v = size - 1; v >= 0; v--) {
            cells[h][v] = {
                id: X_AXE[v] + '_' + (h + 1),
                x: v,
                y: h,
                xLabel: X_AXE[v],
                yLabel: h + 1,
                ship: null,
                isHit: false,
                isShipNeighbor: false,
                isKilledShipNeighborCell: false
            };
        }
    }
    return cells;
};
