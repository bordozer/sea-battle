import React from 'react';
import {getRandomHiddenCell, getVisibleCellsCount} from 'src/utils/cells-utils'
import {getBiggestAliveShip} from 'src/utils/ships-utils'
import AiDamagedShip from 'src/utils/ai-damaged-ship'
import AiLevel1 from 'src/utils/ai-level1'
import AiLevel2 from 'src/utils/ai-level2'
import AiLevel3 from 'src/utils/ai-level3'
import {randomElement} from 'src/utils/random-utils'

const FIRST_RANDOM_SHOOTS_COUNT = 10;

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

    const biggestAliveShip = getBiggestAliveShip(ships);
    const shipSize = biggestAliveShip.size;
    if (shipSize === 1) {
        return {
            shoots: [],
            strategy: 'single-ship-no-strategy'
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
        let shoots = level3Shot(cells, ships);
        // console.log("Player hints: level3", shoots);
        if (shoots.length > 0) {
            return {
                shoots: shoots,
                strategy: 'level3'
            };
        }
        const shoots2 = level2Shot(cells, ships);
        // console.log("Player hints: level3->2", shoots2);
        return {
            shoots: shoots2,
            strategy: 'level2'
        };
    }

    return {
        shoots: [],
        strategy: 'no-strategy-stub'
    };
};

export const getEnemyShot = (cells, ships, playerDamagedShipCells, difficultyLevel) => {
    if (playerDamagedShipCells.length > 0) {
        // console.log("WOUNDED", playerDamagedShipCells.length, 'cells');
        return new AiDamagedShip().getCells(cells, playerDamagedShipCells);
    }

    if (getVisibleCellsCount(cells) < FIRST_RANDOM_SHOOTS_COUNT) {
        // console.log("Enemy shoot: first 10 shoots are random");
        return getRandomHiddenCell(cells);
    }

    const biggestAliveShip = getBiggestAliveShip(ships);
    const shipSize = biggestAliveShip.size;
    if (shipSize === 1) {
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
        // console.log("level2 cellsForShoot", cellsForShoot);
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
