import React from 'react';

export const getCellsByFilter = (cells, filter) => {
    const result = [];
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells.length; y++) {
            const cell = cells[x][y];
            if (filter(cell)) {
                result.push(cell);
            }
        }
    }
    return result;
}
