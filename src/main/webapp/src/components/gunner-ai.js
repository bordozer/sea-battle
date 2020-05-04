import React from 'react';
import {getRandomHiddenCell, getVisibleCellsCount} from 'src/utils/cells-utils'
import {getBiggestAliveShip} from 'src/utils/ships-utils'
import AiDamagedShip from 'src/utils/ai-damaged-ship'
import AiLevel1 from 'src/utils/ai-level1'
import AiLevel2 from 'src/utils/ai-level2'
import AiLevel3 from 'src/utils/ai-level3'
import {randomElement} from 'src/utils/random-utils'

const FIRST_RANDOM_SHOTS_COUNT = 10;

function level1Shot(cells) {
    return new AiLevel1().getCells(cells);
}

function level2Shot(cells, ships) {
    return new AiLevel2().getCells(cells, ships);
}

function level3Shot(cells, ships) {
    return new AiLevel3().getCells(cells, ships);
}

export const getRecommendedShots = (cells, ships, enemyDamagedShipCells, difficultyLevel) => {
    if (enemyDamagedShipCells.length > 0) {
        // console.log("enemyDamagedShipCells", enemyDamagedShipCells);
        return {
            shots: new AiDamagedShip().getCells(cells, enemyDamagedShipCells),
            strategy: 'level3'
        };
    }

    if (difficultyLevel === 1) {
        // console.log("Player hints: level1");
        return {
            shots: [],
            strategy: 'level1'
        };
    }

    if (getVisibleCellsCount(cells) < FIRST_RANDOM_SHOTS_COUNT) {
        return {
            shots: [],
            strategy: 'no-strategy-for-first-shots'
        };
    }

    const biggestAliveShip = getBiggestAliveShip(ships);
    const shipSize = biggestAliveShip.size;
    if (shipSize === 1) {
        return {
            shots: [],
            strategy: 'single-ship-no-strategy'
        };
    }

    if (difficultyLevel === 2) {
        // console.log("Player hints: level2");
        return {
            shots: level2Shot(cells, ships),
            strategy: 'level2'
        };
    }
    if (difficultyLevel === 3) {
        let shots = level3Shot(cells, ships);
        if (shots.length > 0) {
            return {
                shots: shots,
                strategy: 'level3'
            };
        }
        const shots2 = level2Shot(cells, ships);
        return {
            shots: shots2,
            strategy: 'level2'
        };
    }

    return {
        shots: [],
        strategy: 'no-strategy-stub'
    };
};

export const getEnemyShot = (cells, ships, playerDamagedShipCells, difficultyLevel) => {
    if (playerDamagedShipCells.length > 0) {
        // console.log("WOUNDED", playerDamagedShipCells.length, 'cells');
        return randomElement(new AiDamagedShip().getCells(cells, playerDamagedShipCells));
    }

    if (getVisibleCellsCount(cells) < FIRST_RANDOM_SHOTS_COUNT) {
        // console.log("Enemy shot: first 10 shots are random");
        return getRandomHiddenCell(cells);
    }

    const biggestAliveShip = getBiggestAliveShip(ships);
    const shipSize = biggestAliveShip.size;
    if (shipSize === 1) {
        return getRandomHiddenCell(cells);
    }

    let cellsForShot = [];
    if (difficultyLevel === 1) {
        // console.log("Enemy shot: level1");
        cellsForShot = level1Shot(cells);
    }
    if (difficultyLevel === 2) {
        // console.log("Enemy shot: level2");
        cellsForShot = level2Shot(cells, ships);
        // console.log("level2 cellsForShot", cellsForShot);
    }
    if (difficultyLevel === 3) {
        // console.log("Enemy shot: level3");
        cellsForShot = level3Shot(cells, ships);
        if (cellsForShot.length === 0) {
            // console.log("Enemy shot: level3->2");
            cellsForShot = level2Shot(cells, ships);
        }
    }
    if (cellsForShot.length === 0) {
        // console.log("Enemy shot: No other ways - random shot");
        cellsForShot = getRandomHiddenCell(cells);
    }

    return randomElement(cellsForShot);
};
