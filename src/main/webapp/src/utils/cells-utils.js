/* jshint esversion: 6 */
import React from 'react';

import {randomElement} from 'src/utils/random-utils';

export const getCellsByFilter = (cells, filter) => {
    const result = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells.length; x++) {
            const cell = cells[y][x];
            if (filter(cell)) {
                result.push(cell);
            }
        }
    }
    return result;
};

export const getVisibleCellsCount = (cells) => {
    let result = 0;
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells.length; x++) {
            const cell = cells[y][x];
            if (!isHiddenCell(cell)) {
                result++;
            }
        }
    }
    return result;
};

export const isHiddenCell = (cell) => {
    return cell && !cell.isHit && !cell.isKilledShipNeighborCell;
};

export const getRandomHiddenCells = (cells) => {
    return getCellsByFilter(cells, isHiddenCell);
};

export const getRandomHiddenCell = (cells) => {
    return randomElement(getCellsByFilter(cells, isHiddenCell));
};
