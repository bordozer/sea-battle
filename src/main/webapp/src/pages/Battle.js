import React, {Component} from 'react';

import Swal from "sweetalert2";

import {generateRandomBattleField, initBattleField} from 'components/battle-field-generator'
import BattleFieldRenderer from 'components/battle-field-renderer'

const WELCOME_MESSAGE = {
    time: new Date(),
    text: "Ready for a new fight? Setup your ships on left square (or use Randomize button) then press Start. Click on right square when your move",
    type: 'info'
}

const STEP_SETUP = 'STEP_SETUP';
const STEP_BATTLE = 'STEP_BATTLE';
const STEP_FINAL = 'STEP_FINAL';

const BATTLE_FIELD_SIZE = 10;
const SHIP_CELL_COUNT = 20;

export default class BattlePage extends Component {

    state = {
        playerCells: initBattleField(BATTLE_FIELD_SIZE),
        enemyCells: initBattleField(BATTLE_FIELD_SIZE),
        step: STEP_SETUP,
        remainsShip: SHIP_CELL_COUNT,
        logs: [WELCOME_MESSAGE],
        config: {
            battleFieldSize: 10
        }
    };

    playerCellSetup = (cell) => {
        if (this.state.step !== STEP_SETUP) {
            return;
        }
        // console.log("playerCellSetup", cell);

        const isShipInCell = cell.isShip;
        const remainsShip = this.state.remainsShip;
        if (!isShipInCell && remainsShip === 0) {
            Swal.fire(
                'No more rooms!',
                "You've set all ships.",
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
        if (this.state.step === STEP_SETUP) {
            Swal.fire(
                'The battle is not started yet',
                'Setup your ships and click START button.',
                'info'
            );
            return;
        }
        if (this.state.step === STEP_FINAL) {
            Swal.fire(
                'The battle is over now',
                'This battle is over. But you can start another one.',
                'info'
            );
            return;
        }
        let step = this.state.step;
        const enemyCells = this.state.enemyCells;
        const enemyCell = enemyCells[cell.y][cell.x];
        if (enemyCell.isHit) {
            this.state.logs.push(this.createLogRecord("Cell " + cell.xLabel + ':' + cell.yLabel + ' has already been hit. Chose another one.'));
            this.setState({
                logs: this.state.logs
            });
            return ''
        }

        enemyCell.isHit = true;

        if (!enemyCell.isShip) {
            this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (missed)'));
            if (this.enemyShot()) {
                step = STEP_FINAL;
            }
        }

        if (enemyCell.isShip) {
            this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (killed)'));
            if (this.isWinShot(this.state.enemyCells)) {
                Swal.fire(
                    'You have won!',
                    'You are just lucky bastard. Next time you will have no chance.',
                    'info'
                );
                step = STEP_FINAL;
            }
        }

        this.setState({
            enemyCells: this.state.enemyCells,
            logs: this.state.logs,
            step: step
        });
    }

    enemyShot = () => {
        const playerCell = this.getRandomNotHitCell();

        playerCell.isHit = true;
        if (playerCell.isShip) {
            this.state.logs.push(this.createLogRecord("Enemy's shot: " + playerCell.xLabel + ':' + playerCell.yLabel + ' (killed)'));
            if (this.isWinShot(this.state.playerCells)) {
                Swal.fire(
                    'Enemy has won!',
                    'You are loser. Live with this.',
                    'info'
                );
                return true;
            }
            return this.enemyShot();
        }

        if (!playerCell.isShip) {
            this.state.logs.push(this.createLogRecord("Enemy's shot: " + playerCell.xLabel + ':' + playerCell.yLabel + ' (missed)'));
        }

        return false;
    }

    isWinShot = (cells) => {
        let killed = 0;
        for (let x = 0; x < BATTLE_FIELD_SIZE; x++) {
            for (let y = 0; y < BATTLE_FIELD_SIZE; y++) {
                const cell = cells[x][y];
                if (cell.isShip && cell.isHit) {
                    killed++;
                    if (killed === SHIP_CELL_COUNT) {
                        return true;
                    }
                }
            }
        }
        return false;
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
        this.state.enemyCells = this.randomizeBattleField();

        // random - who's first shot
        let isEnemyWin = false;
        const firstMove = Math.floor(Math.random() * Math.floor(2));
        this.state.logs.push(this.createLogRecord('The battle has began!'));
        this.state.logs.push(this.createLogRecord('The first move: ' + (firstMove === 0 ? 'you' : 'enemy')));
        if (firstMove === 1) {
            isEnemyWin = this.enemyShot();
        }

        this.setState({
            step: isEnemyWin ? STEP_FINAL : STEP_BATTLE,
            playerCells: this.state.playerCells,
            enemyCells: this.state.enemyCells,
            logs: this.state.logs
        });
    }

    randomizeBattleField = () => {
        return generateRandomBattleField(BATTLE_FIELD_SIZE, SHIP_CELL_COUNT);
    }

    getRandomNotHitCell = () => {
        const cells = [];
        for (let x = 0; x < BATTLE_FIELD_SIZE; x++) {
            for (let y = 0; y < BATTLE_FIELD_SIZE; y++) {
                if (!this.state.playerCells[x][y].isHit) {
                    cells.push(this.state.playerCells[x][y]);
                }
            }
        }
        // console.log("-->", cells.length);
        const number = Math.floor(Math.random() * Math.floor(cells.length));
        return cells[number];
    }

    randomizePlayersShips = () => {
        if (BATTLE_FIELD_SIZE * BATTLE_FIELD_SIZE < SHIP_CELL_COUNT) {
            Swal.fire(
                'Wrong configuration!',
                'There are not enough rooms for all ships',
                'info'
            );
            return;
        }
        this.state.logs.push(this.createLogRecord("Randomize player's ships"));
        this.setState({
            playerCells: this.randomizeBattleField(),
            remainsShip: 0,
            logs: this.state.logs
        });
    }

    resetBattle = () => {
        this.setState({
            playerCells: initBattleField(BATTLE_FIELD_SIZE),
            enemyCells: initBattleField(BATTLE_FIELD_SIZE),
            step: STEP_SETUP,
            remainsShip: SHIP_CELL_COUNT,
            logs: [WELCOME_MESSAGE]
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

    calculateLost = (cells) => {
        let result = 0;
        for (let x = 0; x < BATTLE_FIELD_SIZE; x++) {
            for (let y = 0; y < BATTLE_FIELD_SIZE; y++) {
                const cell = cells[x][y];
                if (cell.isShip && cell.isHit) {
                    result++;
                }
            }
        }
        return result;
    }

    render() {
        // console.log('BattlePage:', this.state);
        // console.log(this.state.logs);
        const battleStarted = this.state.step !== STEP_SETUP;
        const playerOpts = {
            isHiddenShips: false,
            isBattleStarted: battleStarted
        }
        const enemyOpts = {
            isHiddenShips: true,
            isBattleStarted: battleStarted
        }

        const playerLost = this.calculateLost(this.state.playerCells);
        const enemyLost = this.calculateLost(this.state.enemyCells);

        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-1"/>
                    <div className="col-sm-5 text-center text-warning">
                        <h4>You</h4>
                    </div>
                    <div className="col-sm-5 text-center text-warning">
                        <h4>Enemy</h4>
                    </div>
                    <div className="col-sm-1"/>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-6 border-right">

                                <BattleFieldRenderer
                                    cells={this.state.playerCells}
                                    options={playerOpts}
                                    onCellClick={this.playerCellSetup}
                                />
                    </div>
                    <div className="col-sm-6">
                        <BattleFieldRenderer
                            cells={this.state.enemyCells}
                            options={enemyOpts}
                            onCellClick={this.playerShot}
                        />
                    </div>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-3"><h3>Ships: {this.state.remainsShip}</h3></div>

                    <div className="col-sm-6 text-center btn-lg">
                        <button
                            className="bg-primary"
                            onClick={this.startBattle}
                            disabled={this.state.remainsShip > 0 || this.state.step !== STEP_SETUP}>
                            Start battle
                        </button>
                        <button
                            className="bg-primary"
                            onClick={this.randomizePlayersShips}
                            disabled={(this.state.step === STEP_BATTLE) || (this.state.step === STEP_FINAL)}>
                            Randomize ships
                        </button>
                        <button
                            className="bg-primary"
                            onClick={this.resetBattle}>
                            Reset
                        </button>
                    </div>
                    <div className="col-sm-3">
                        <div className="row">
                            <div className="col-sm-7 text-right">Player lost</div>
                            <div className="col-sm-1 text-danger">{playerLost}</div>
                            <div className="col-sm-1">of</div>
                            <div className="col-sm-1">{SHIP_CELL_COUNT}</div>
                            <div className="col-sm-2"/>
                        </div>
                        <div className="row">
                            <div className="col-sm-7 text-right">Enemy lost</div>
                            <div className="col-sm-1 text-danger">{enemyLost}</div>
                            <div className="col-sm-1">of</div>
                            <div className="col-sm-1">{SHIP_CELL_COUNT}</div>
                            <div className="col-sm-2"/>
                        </div>
                    </div>
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
