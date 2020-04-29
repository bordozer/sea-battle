import React, {Component} from 'react';

import {isHiddenCell} from 'src/utils/cells-utils'
import {randomElement} from 'src/utils/random-utils'

function _shotOnceDamagedShipAgain(cells, damagedCell) {
    // console.log("_shotOnceDamagedShipAgain", damagedCell);
    const neighborCells = [];

    if (cells[damagedCell.y - 1] && cells[damagedCell.y][damagedCell.x]) {
        neighborCells.push(cells[damagedCell.y - 1][damagedCell.x]);
    }
    if (cells[damagedCell.y + 1] && cells[damagedCell.y][damagedCell.x]) {
        neighborCells.push(cells[damagedCell.y + 1][damagedCell.x]);
    }
    if (cells[damagedCell.y] && cells[damagedCell.y][damagedCell.x - 1]) {
        neighborCells.push(cells[damagedCell.y][damagedCell.x - 1]);
    }
    if (cells[damagedCell.y] && cells[damagedCell.y][damagedCell.x + 1]) {
        neighborCells.push(cells[damagedCell.y][damagedCell.x + 1]);
    }

    const hittableNeighborCells = neighborCells.filter(cell => {
        return isHiddenCell(cell);
    });
    return randomElement(hittableNeighborCells);
}

export default class AiDamagedShip extends Component {

    getCells = (cells, damagedShipCells) => {
        if (damagedShipCells.length === 1) {
            return _shotOnceDamagedShipAgain(cells, damagedShipCells[0]);
        }

        let firstDamagedCell = damagedShipCells[0];
        let lastDamagedCell = damagedShipCells[damagedShipCells.length - 1];
        const isVerticalShip = firstDamagedCell.x === lastDamagedCell.x;
        if (isVerticalShip) {
            const sorted = damagedShipCells.sort(function (cell1, cell2) {
                return cell1.y - cell2.y;
            });
            firstDamagedCell = sorted[0];
            lastDamagedCell = sorted[sorted.length - 1];
            const targets = [];
            if (cells[firstDamagedCell.y - 1]) {
                targets.push(cells[firstDamagedCell.y - 1][firstDamagedCell.x]);
            }
            if (cells[lastDamagedCell.y + 1]) {
                targets.push(cells[lastDamagedCell.y + 1][lastDamagedCell.x]);
            }
            return randomElement(targets.filter(cell => {
                return isHiddenCell(cell);
            }));
        }

        // horizontal ship
        const sorted = damagedShipCells.sort(function (cell1, cell2) {
            return cell1.x - cell2.x;
        });
        firstDamagedCell = sorted[0];
        lastDamagedCell = sorted[sorted.length - 1];
        const targets = [
            cells[firstDamagedCell.y][firstDamagedCell.x - 1],
            cells[lastDamagedCell.y][lastDamagedCell.x + 1]
        ];
        return randomElement(targets.filter(cell => {
            return isHiddenCell(cell);
        }));
    }
}
