import React, {Component} from 'react';

import Swal from "sweetalert2";

import {initBattleFieldCells} from 'src/utils/battle-field-utils'
import {generateShips, markAllShipNeighborCellsAsKilled} from 'src/utils/ships-utils'
import BattleFieldRenderer from 'components/battle-field-renderer'
import ShipStatisticsRenderer from 'components/ships-stat'

const WELCOME_MESSAGE = {
    time: new Date(),
    text: "Ready for a new fight? Setup your ships on left square (or use Randomize button) then press Start. Click on right square when your move",
    type: 'info'
}

const STEP_READY_TO_START = 'STEP_READY_TO_START';
const STEP_BATTLE = 'STEP_BATTLE';
const STEP_FINAL = 'STEP_FINAL';

const BATTLE_FIELD_SIZE = 10;

export default class BattlePage extends Component {

    state = {
        playerCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
        enemyCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
        playerShips: [],
        enemyShips: [],
        step: null,
        isReadyToStart: false,
        logs: [WELCOME_MESSAGE],
        config: {
            battleFieldSize: 10
        }
    };

    playerCellSetup = (cell) => {
        Swal.fire(
            'Manual ship setup is not supported yet',
            "Click Randomize ships button.",
            'info'
        );
    }

    playerShot = (cell) => {
        if (this.state.step === STEP_READY_TO_START) {
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
            return;
        }
        if (enemyCell.isKilledShipNeighborCell) {
            this.state.logs.push(this.createLogRecord("Cell " + cell.xLabel + ':' + cell.yLabel + ' is a neighbor of killed ship. Chose another one.'));
            this.setState({
                logs: this.state.logs
            });
            return;
        }

        enemyCell.isHit = true;

        const enemyShip = enemyCell.ship;

        // MISSED
        if (!enemyShip) {
            this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (missed)'));
            if (this.enemyShot()) {
                step = STEP_FINAL;
            }
        }

        // HIT a enemyShip
        if (enemyShip) {
            enemyShip.damage++;
            if (enemyShip.damage === enemyShip.size) {
                markAllShipNeighborCellsAsKilled(enemyShip, enemyCells);
            }

            this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (killed)'));
            if (this.isWinShot(this.state.enemyShips)) {
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
        const playerCells = this.state.playerCells;
        const playerCell = this.getRandomCellForHit(playerCells);

        playerCell.isHit = true;
        const playerShip = playerCell.ship;

        if (playerShip) {
            playerShip.damage++;
            if (playerShip.damage === playerShip.size) {
                markAllShipNeighborCellsAsKilled(playerShip, playerCells);
            }
            this.state.logs.push(this.createLogRecord("Enemy's shot: " + playerCell.xLabel + ':' + playerCell.yLabel + ' (killed)'));
            if (this.isWinShot(this.state.playerShips)) {
                Swal.fire(
                    'Enemy has won!',
                    'You are loser. Live with this.',
                    'info'
                );
                return true;
            }
            return this.enemyShot();
        }

        if (!playerShip) {
            this.state.logs.push(this.createLogRecord("Enemy's shot: " + playerCell.xLabel + ':' + playerCell.yLabel + ' (missed)'));
        }

        return false;
    }

    startBattle = () => {
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
        const gameData = this.randomizeBattleFieldWithShips();
        // this.state.enemyCells = gameData.cells;

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
            // playerCells: this.state.playerCells,
            enemyCells: gameData.cells,
            enemyShips: gameData.ships,
            logs: this.state.logs
        });
    }

    randomizeBattleFieldWithShips = () => {
        const cells = initBattleFieldCells(BATTLE_FIELD_SIZE);
        return generateShips(cells);
    }

    getRandomCellForHit = (cells) => {
        const hitableCells = [];
        for (let x = 0; x < BATTLE_FIELD_SIZE; x++) {
            for (let y = 0; y < BATTLE_FIELD_SIZE; y++) {
                const cell = cells[x][y];
                if (!cell.isHit && !cell.isKilledShipNeighborCell) {
                    hitableCells.push(cell);
                }
            }
        }
        // console.log("-->", hitableCells.length);
        const number = Math.floor(Math.random() * Math.floor(hitableCells.length));
        return hitableCells[number];
    }

    randomizePlayersShips = () => {
        this.state.logs.push(this.createLogRecord("Randomize player's ships"));
        const gameData = this.randomizeBattleFieldWithShips();
        this.setState({
            playerCells: gameData.cells,
            playerShips: gameData.ships,
            step: STEP_READY_TO_START,
            logs: this.state.logs
        });
    }

    resetBattle = () => {
        this.setState({
            playerCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
            enemyCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
            playerShips: [],
            enemyShips: [],
            step: null,
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

    isWinShot = (ships) => {
        const liveShips = ships.filter(ship => {
            return ship.damage < ship.size;
        });
        return liveShips.length === 0;
    }

    render() {
        // console.log('BattlePage:', this.state);
        // console.log(this.state.logs);
        const isSetupStep = (this.state.step === null) || (this.state.step === STEP_READY_TO_START);
        const playerOpts = {
            isHiddenShips: false,
            isSetupStep: isSetupStep
        }
        const enemyOpts = {
            isHiddenShips: true,
            isSetupStep: isSetupStep
        }

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
                    <div className="col-sm-1">
                        <ShipStatisticsRenderer ships={this.state.playerShips} isPlayer={true}/>
                    </div>
                    <div className="col-sm-5">
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
                    <div className="col-sm-1">
                        <ShipStatisticsRenderer ships={this.state.enemyShips} isPlayer={false}/>
                    </div>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-3"/>
                    <div className="col-sm-6 text-center btn-lg">
                        <button
                            className="bg-primary"
                            onClick={this.startBattle}
                            disabled={this.state.step !== STEP_READY_TO_START}>
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
                    <div className="col-sm-3"/>
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
