import React, {Component} from 'react';

import Swal from "sweetalert2";

import BattleFieldRenderer from 'components/battle-field-renderer'

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const BATTLE_FIELD_SIZE = 10;
const SHIP_CELL_COUNT = 3;
const STEP_SETUP = 'STEP_SETUP';
const STEP_BATTLE = 'STEP_BATTLE';

export default class BattlePage extends Component {

    initCells = (size) => {
        const playerCells = [];
        const enemyCells = [];
        // console.log('cellItems1', playerCells);
        for (let h = size - 1; h >= 0; h--) {
            playerCells[h] = [];
            enemyCells[h] = [];
            for (let v = size - 1; v >= 0; v--) {
                playerCells[h][v] = {
                    x: v,
                    y: h,
                    xLabel: X_AXE[v],
                    yLabel: h + 1,
                    isShip: false,
                    isHit: false
                };
                enemyCells[h][v] = {
                    x: v,
                    y: h,
                    xLabel: X_AXE[v],
                    yLabel: h + 1,
                    isShip: false,
                    isHit: false
                };
            }
        }
        // console.log('cellItems2', playerCells);
        return {
            playerCells: playerCells,
            enemyCells: enemyCells,
        }
    };
    cells = this.initCells(BATTLE_FIELD_SIZE);

    state = {
        'playerCells': this.cells.playerCells,
        'enemyCells': this.cells.enemyCells,
        'step': STEP_SETUP,
        'remainsShip': SHIP_CELL_COUNT,
        'logs': []
    };

    ownBattleFieldCellClicked = (cell) => {
        if (this.state.step !== STEP_SETUP) {
            return;
        }
        console.log("ownBattleFieldCellClicked", cell);

        const isShipInCell = cell.isShip;
        const remainsShip = this.state.remainsShip;
        if (!isShipInCell && remainsShip === 0) {
            Swal.fire(
                'No more rooms!',
                'You set all ships.',
                'info'
            );
            return;
        }

        const aCell = this.state.playerCells[cell.y][cell.x];
        aCell.isShip = !isShipInCell;

        const logs = this.state.logs;
        logs.push("Set ship at " + cell.xLabel + ":" + cell.yLabel);

        this.setState({
            playerCells: this.state.playerCells,
            remainsShip: isShipInCell ? remainsShip + 1 : remainsShip - 1,
            logs: logs
        });
        // console.log("ownBattleFieldCellClicked", this.state.playerCells);
    }

    anotherPlayerBattleFieldCellClicked = (cell) => {
        if (this.state.step !== STEP_BATTLE) {
            return;
        }
        console.log("anotherPlayerBattleFieldCellClicked", cell);
        /*this.setState({
            step: 'BATTLE'
        });*/
    }

    startBattle = () => {
        if (this.state.step !== STEP_SETUP) {
            return;
        }
        if (this.state.remainsShip > 0) {
            Swal.fire(
                'Setup is not finished!',
                'You need to set ' + this.state.remainsShip + ' more ships',
                'info'
            );
            return;
        }
        console.log("The battle has began");

        // calculate enemyShips
        let enemyShips = SHIP_CELL_COUNT;
        while(enemyShips > 0) {
            const x = Math.floor(Math.random() * Math.floor(BATTLE_FIELD_SIZE));
            const y = Math.floor(Math.random() * Math.floor(BATTLE_FIELD_SIZE));
            if (!this.state.enemyCells[x][y].isShip) {
                this.state.enemyCells[x][y].isShip = true;
                enemyShips--;
            }
        }
        // random - who's first shot
        const firstMove = Math.floor(Math.random() * Math.floor(2));
        this.state.logs.push('The first move: ' + (firstMove === 0 ? 'you' : 'enemy'));

        this.setState({
            step: STEP_BATTLE,
            enemyCells: this.state.enemyCells,
            logs: this.state.logs
        });
    }

    resetBattle = () => {
        const cells = this.initCells(BATTLE_FIELD_SIZE);
        this.setState({
            playerCells: cells.playerCells,
            enemyCells: cells.enemyCells,
            step: STEP_SETUP,
            remainsShip: SHIP_CELL_COUNT,
            logs: []
        });
    }

    renderLogs = () => {
        const result = [];
        let counter = 0;
        this.state.logs.forEach(rec => {
            result.push(
                <div key={'log-row-' + counter} className="row">
                    <div key={'log-row-col-' + counter} className="col-sm-12 small text-muted">
                        {rec}
                    </div>
                </div>
            );
            counter++;
        });
        return result;
    }

    render() {
        // console.log('BattlePage:', this.state);
        console.log(this.state.logs);
        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-1"/>
                    <div className="col-sm-5 border-right border-light">
                        <BattleFieldRenderer cells={this.state.playerCells} onCellClick={this.ownBattleFieldCellClicked}/>
                    </div>
                    <div className="col-sm-5">
                        <BattleFieldRenderer cells={this.state.enemyCells} onCellClick={this.anotherPlayerBattleFieldCellClicked}/>
                    </div>
                    <div className="col-sm-1"/>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-4"><h3>Ships: {this.state.remainsShip}</h3></div>
                    <div className="col-sm-4 text-center btn-lg">
                        <button
                            className="bg-primary"
                            onClick={this.startBattle}
                            disabled={this.state.remainsShip > 0 || this.state.step !== STEP_SETUP}>
                            Start battle
                        </button>
                        <button
                            className="bg-primary"
                            onClick={this.resetBattle}
                            disabled={this.state.step !== STEP_BATTLE}>
                            Reset battle
                        </button>
                    </div>
                    <div className="col-sm-4"/>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-12">
                        {this.renderLogs()}
                    </div>
                </div>

            </div>
        );
    }
}
