import React from 'react';
import {getRandomHiddenCell, getVisibleCellsCount, isHiddenCell} from 'src/utils/cells-utils'
import AiLevel1 from 'src/utils/ai-level1'
import AiLevel2 from 'src/utils/ai-level2'
import AiLevel3 from 'src/utils/ai-level3'
import {randomElement} from 'src/utils/random-utils'

const FIRST_RANDOM_SHOOTS_COUNT = 10;

function _shotOnceWoundedShipAgain(cells, woundedCell) {
    // console.log("_shotOnceWoundedShipAgain", woundedCell);
    const neighborCells = [];

    if (cells[woundedCell.y - 1] && cells[woundedCell.y][woundedCell.x]) {
        neighborCells.push(cells[woundedCell.y - 1][woundedCell.x]);
    }
    if (cells[woundedCell.y + 1] && cells[woundedCell.y][woundedCell.x]) {
        neighborCells.push(cells[woundedCell.y + 1][woundedCell.x]);
    }
    if (cells[woundedCell.y] && cells[woundedCell.y][woundedCell.x - 1]) {
        neighborCells.push(cells[woundedCell.y][woundedCell.x - 1]);
    }
    if (cells[woundedCell.y] && cells[woundedCell.y][woundedCell.x + 1]) {
        neighborCells.push(cells[woundedCell.y][woundedCell.x + 1]);
    }

    const hittableNeighborCells = neighborCells.filter(cell => {
        return isHiddenCell(cell);
    });
    return randomElement(hittableNeighborCells);
}

function finishingOffWoundedShip(cells, playerWoundedShipCells) {
    if (playerWoundedShipCells.length === 1) {
        return _shotOnceWoundedShipAgain(cells, playerWoundedShipCells[0]);
    }

    // console.log("finishingOffWoundedShip", playerWoundedShipCells.length, 'cells');
    let firstWoundedCell = playerWoundedShipCells[0];
    let lastWoundedCell = playerWoundedShipCells[playerWoundedShipCells.length - 1];
    const isVerticalShip = firstWoundedCell.x === lastWoundedCell.x;
    if (isVerticalShip) {
        const sorted = playerWoundedShipCells.sort(function (cell1, cell2) {
            return cell1.y - cell2.y;
        });
        firstWoundedCell = sorted[0];
        lastWoundedCell = sorted[sorted.length - 1];
        const targets = [];
        if (cells[firstWoundedCell.y - 1]) {
            targets.push(cells[firstWoundedCell.y - 1][firstWoundedCell.x]);
        }
        if (cells[lastWoundedCell.y + 1]) {
            targets.push(cells[lastWoundedCell.y + 1][lastWoundedCell.x]);
        }
        return randomElement(targets.filter(cell => {
            return isHiddenCell(cell);
        }));
    }

    // horizontal ship
    const sorted = playerWoundedShipCells.sort(function (cell1, cell2) {
        return cell1.x - cell2.x;
    });
    firstWoundedCell = sorted[0];
    lastWoundedCell = sorted[sorted.length - 1];
    const targets = [
        cells[firstWoundedCell.y][firstWoundedCell.x - 1],
        cells[lastWoundedCell.y][lastWoundedCell.x + 1]
    ];
    return randomElement(targets.filter(cell => {
        return isHiddenCell(cell);
    }));
}

function level1Shot(cells) {
    return new AiLevel1().getCells(cells);
}

function level2Shot(cells, ships) {
    return new AiLevel2().getCells(cells, ships);
}

function level3Shot(cells, ships) {
    return new AiLevel3().getCells(cells, ships);
}

export const getRecommendedShots = (cells, ships, difficultyLevel) => {
    if (getVisibleCellsCount(cells) < FIRST_RANDOM_SHOOTS_COUNT) {
        return {
            shoots: [],
            strategy: 'no-strategy-for-first-shoots'
        };
    }

    if (difficultyLevel === 1) {
        // console.log("Player hints: level1");
        return {
            shoots: [],
            strategy: 'level1'
        };
    }
    if (difficultyLevel === 2) {
        // console.log("Player hints: level2");
        return {
            shoots: level2Shot(cells, ships),
            strategy: 'level2'
        };
    }
    if (difficultyLevel === 3) {
        // console.log("Player hints: level3");
        let shoots = level3Shot(cells, ships);
        if (shoots.length > 0) {
            return {
                shoots: shoots,
                strategy: 'level3'
            };
        }
        // console.log("Player hints: level3->2");
        return {
            shoots: level2Shot(shoots, ships),
            strategy: 'level2'
        };
    }

    return {
        shoots: [],
        strategy: 'no-strategy-stub'
    };
};

export const getEnemyShot = (cells, ships, playerWoundedShipCells, difficultyLevel) => {
    if (playerWoundedShipCells.length > 0) {
        // console.log("WOUNDED", playerWoundedShipCells.length, 'cells');
        return finishingOffWoundedShip(cells, playerWoundedShipCells);
    }

    if (getVisibleCellsCount(cells) < FIRST_RANDOM_SHOOTS_COUNT) {
        // console.log("Enemy shoot: first 10 shoots are random");
        return getRandomHiddenCell(cells);
    }

    let cellsForShoot = [];
    if (difficultyLevel === 1) {
        // console.log("Enemy shoot: level1");
        cellsForShoot = level1Shot(cells);
    }
    if (difficultyLevel === 2) {
        // console.log("Enemy shoot: level2");
        cellsForShoot = level2Shot(cells, ships);
    }
    if (difficultyLevel === 3) {
        // console.log("Enemy shoot: level3");
        cellsForShoot = level3Shot(cells, ships);
        if (cellsForShoot.length === 0) {
            // console.log("Enemy shoot: level3->2");
            cellsForShoot = level2Shot(cells, ships);
        }
    }
    if (cellsForShoot.length === 0) {
        // console.log("Enemy shoot: No other ways - random shoot");
        cellsForShoot = getRandomHiddenCell(cells);
    }

    return randomElement(cellsForShoot);
};
