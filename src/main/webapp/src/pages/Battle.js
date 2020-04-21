import React, {Component} from 'react';

import Swal from "sweetalert2";

import BattleFieldRenderer from 'components/battle-field-renderer'

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const BATTLE_FIELD_SIZE = 10;
const SHIP_CELL_COUNT = 16;
const STEP_SETUP = 'STEP_SETUP';
const STEP_BATTLE = 'STEP_BATTLE';

export default class BattlePage extends Component {

    initCells = (size) => {
        const cells = [];
        // console.log('cellItems1', cells);
        for (let h = size - 1; h >= 0; h--) {
            cells[h] = [];
            for (let v = size - 1; v >= 0; v--) {
                cells[h][v] = {
                    x: v,
                    y: h,
                    xLabel: X_AXE[v],
                    yLabel: h + 1,
                    isShip: false,
                    isHit: false
                };
            }
        }
        // console.log('cellItems2', cells);
        return cells;
    };

    state = {
        'playerCells': this.initCells(BATTLE_FIELD_SIZE),
        'enemyCells': this.initCells(BATTLE_FIELD_SIZE),
        'step': STEP_SETUP,
        'remainsShip': SHIP_CELL_COUNT,
        'logs': []
    };

    playerCellSetup = (cell) => {
        if (this.state.step !== STEP_SETUP) {
            return;
        }
        console.log("playerCellSetup", cell);

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
        logs.push(this.createLogRecord("Set ship at " + cell.xLabel + ":" + cell.yLabel));

        this.setState({
            playerCells: this.state.playerCells,
            remainsShip: isShipInCell ? remainsShip + 1 : remainsShip - 1,
            logs: logs
        });
        // console.log("playerCellSetup", this.state.playerCells);
    }

    playerShot = (cell) => {
        if (this.state.step !== STEP_BATTLE) {
            Swal.fire(
                'The battle is not started yet!',
                'Setup your ships and click START button.',
                'info'
            );
            return;
        }

        const enemyCells = this.state.enemyCells;
        const enemyCell = enemyCells[cell.y][cell.x];
        if (enemyCell.isHit) {
            this.state.logs.push(this.createLogRecord("Cell " + cell.xLabel + ':' + cell.yLabel + ' has already been hit. Chose another one.'));
            this.setState({
                logs: this.state.logs
            });
            return''
        }

        enemyCell.isHit = true;

        if (!enemyCell.isShip) {
            this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (missed)'));
            this.enemyShot();
        }

        if (enemyCell.isShip) {
            this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (killed)'));
        }

        this.setState({
            enemyCells: this.state.enemyCells,
            logs: this.state.logs
        });
    }

    enemyShot = () => {
        while (true) {
            // TODO: check if it is the end of game
            const shot = this.getRandomCoordinates();
            const playerCell = this.state.playerCells[shot.x][shot.y];
            if (playerCell.isHit) {
                continue
            }

            playerCell.isHit = true;
            if (playerCell.isShip) {
                this.state.logs.push(this.createLogRecord("Enemy's shot: " + playerCell.xLabel + ':' + playerCell.yLabel + ' (killed)'));
                this.enemyShot();
            }

            if (!playerCell.isShip) {
                this.state.logs.push(this.createLogRecord("Enemy's shot: " + playerCell.xLabel + ':' + playerCell.yLabel + ' (missed)'));
            }

            break;
        }
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

        // randomize enemyShips
        this.state.enemyCells = this.randomizeShips();

        // random - who's first shot
        const firstMove = Math.floor(Math.random() * Math.floor(2));
        this.state.logs.push(this.createLogRecord('The battle has began!'));
        this.state.logs.push(this.createLogRecord('The first move: ' + (firstMove === 0 ? 'you' : 'enemy')));
        if (firstMove === 1) {
            this.enemyShot();
        }

        this.setState({
            step: STEP_BATTLE,
            playerCells: this.state.playerCells,
            enemyCells: this.state.enemyCells,
            logs: this.state.logs
        });
    }

    randomizeShips = () => {
        const cells = this.initCells(BATTLE_FIELD_SIZE);
        let shipsCount = SHIP_CELL_COUNT;
        while (shipsCount > 0) {
            const coord = this.getRandomCoordinates();
            if (!cells[coord.x][coord.y].isShip) {
                cells[coord.x][coord.y].isShip = true;
                shipsCount--;
            }
        }
        return cells;
    }

    getRandomCoordinates = () => {
        const x = Math.floor(Math.random() * Math.floor(BATTLE_FIELD_SIZE));
        const y = Math.floor(Math.random() * Math.floor(BATTLE_FIELD_SIZE));
        return {
            x: x,
            y: y
        }
    }

    randomizePlayersShips = () => {
        this.state.logs.push(this.createLogRecord("Randomize player's ships"));
        this.setState({
            playerCells: this.randomizeShips(),
            remainsShip: 0,
            logs: this.state.logs
        });
    }

    resetBattle = () => {
        this.setState({
            playerCells: this.initCells(BATTLE_FIELD_SIZE),
            enemyCells: this.initCells(BATTLE_FIELD_SIZE),
            step: STEP_SETUP,
            remainsShip: SHIP_CELL_COUNT,
            logs: []
        });
    }

    createLogRecord = (text) => {
        return {
            time: new Date(),
            text: text
        }
    }

    renderLogs = () => {
        const result = [];
        let counter = 0;
        this.state.logs
            .reverse()
            .forEach(rec => {
                result.push(
                    <div key={'log-row-' + counter} className="row">
                        <div key={'log-row-col-' + counter} className="col-sm-12 small text-muted">
                            {rec.text}
                        </div>
                    </div>
                );
                counter++;
            });
        return result;
    }

    render() {
        // console.log('BattlePage:', this.state);
        // console.log(this.state.logs);
        const playerOpts = {
            isHiddenShips: false,
            isBattleStarted: this.state.step === STEP_BATTLE
        }
        const enemyOpts = {
            isHiddenShips: true,
            isBattleStarted: this.state.step === STEP_BATTLE
        }
        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-1"/>
                    <div className="col-sm-5 border-right border-light">
                        <BattleFieldRenderer
                            cells={this.state.playerCells}
                            options={playerOpts}
                            onCellClick={this.playerCellSetup}
                        />
                    </div>
                    <div className="col-sm-5">
                        <BattleFieldRenderer
                            cells={this.state.enemyCells}
                            options={enemyOpts}
                            onCellClick={this.playerShot}
                        />
                    </div>
                    <div className="col-sm-1"/>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-2"><h3>Ships: {this.state.remainsShip}</h3></div>

                    <div className="col-sm-8 text-center btn-lg">
                        <button
                            className="bg-primary"
                            onClick={this.startBattle}
                            disabled={this.state.remainsShip > 0 || this.state.step !== STEP_SETUP}>
                            Start battle
                        </button>
                        <button
                            className="bg-primary"
                            onClick={this.randomizePlayersShips}
                            disabled={this.state.step !== STEP_SETUP}>
                            Randomize ships
                        </button>
                        <button
                            className="bg-primary"
                            onClick={this.resetBattle}
                            disabled={this.state.step !== STEP_BATTLE}>
                            Reset battle
                        </button>
                    </div>

                    <div className="col-sm-2"/>
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
