import React, {Component} from 'react';

import Swal from "sweetalert2";

import {initBattleFieldCells} from 'src/utils/battle-field-utils'
import {generateShips, markAllShipNeighborCellsAsKilled} from 'src/utils/ships-utils'
import {getEnemyShot, getRecommendedShots} from 'components/gunner-ai'
import BattleFieldRenderer from 'components/battle-field-renderer'
import DifficultyLevelRenderer from 'components/difficulty-level'
import ShipStatisticsRenderer from 'components/ships-stat'

const WELCOME_MESSAGE = {
    time: new Date(),
    text: "Ready for a new fight? Setup your ships on left square (or use Randomize button) then press Start. Click on right square when your move",
    type: 'info'
};

const STEP_READY_TO_START = 'STEP_READY_TO_START';
const STEP_BATTLE = 'STEP_BATTLE';
const STEP_FINAL = 'STEP_FINAL';

const BATTLE_FIELD_SIZE = 10;

export default class BattlePage extends Component {

    state = {
        playerCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
        playerShips: [],
        playerLastShot: null,
        playerWoundedShipCells: [],
        enemyCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
        enemyShips: [],
        enemyLastShot: null,
        step: null,
        isReadyToStart: false,
        difficultyLevel: 2,
        showShootHints: true,
        logs: [WELCOME_MESSAGE]
    };

    playerCellSetup = (cell) => {
        Swal.fire(
            'Manual ship setup is not supported yet',
            "Click Randomize ships button.",
            'info'
        );
    };

    playerShot = (cell) => {
        if ((this.state.step === null) || (this.state.step === STEP_READY_TO_START)) {
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
        let enemyLastShot = this.state.enemyLastShot;
        let playerWoundedShipCells = this.state.playerWoundedShipCells;

        const enemyCells = this.state.enemyCells;
        const enemyShips = this.state.enemyShips;

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
            const enemyMove = this.enemyShot(playerWoundedShipCells);
            enemyLastShot = enemyMove.enemyLastShot;
            playerWoundedShipCells = enemyMove.playerWoundedShipCells;
            if (enemyMove.isEnemyWon) {
                step = STEP_FINAL;
            }
        }

        // HIT a enemyShip
        if (enemyShip) {
            enemyShip.damage++;
            if (enemyShip.damage === enemyShip.size) {
                this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (killed)'));
                markAllShipNeighborCellsAsKilled(enemyShip, enemyCells);
            } else {
                this.state.logs.push(this.createLogRecord("Player's shot: " + cell.xLabel + ':' + cell.yLabel + ' (wounded)'));
            }

            if (this.isWinShot(enemyShips)) {
                Swal.fire(
                    'You have won!',
                    'You are just a lucky bastard. Tou will have no chance next time.',
                    'success'
                );
                step = STEP_FINAL;
            }
        }

        this.setState({
            enemyCells: this.state.enemyCells,
            playerLastShot: cell,
            enemyLastShot: enemyLastShot,
            playerWoundedShipCells: playerWoundedShipCells,
            logs: this.state.logs,
            step: step
        });
    };

    enemyShot = (playerWoundedShipCells) => {
        const playerCells = this.state.playerCells;
        const playerShips = this.state.playerShips;

        const hitPlayerCell = getEnemyShot(playerCells, playerShips, playerWoundedShipCells, this.state.difficultyLevel);

        hitPlayerCell.isHit = true;
        const playerShip = hitPlayerCell.ship;
        let woundedCells = playerWoundedShipCells;

        if (playerShip) {
            playerShip.damage++;
            if (playerShip.damage === playerShip.size) {
                woundedCells = [];
                this.state.logs.push(this.createLogRecord("Enemy's shot: " + hitPlayerCell.xLabel + ':' + hitPlayerCell.yLabel + ' (killed)'));
                markAllShipNeighborCellsAsKilled(playerShip, playerCells);
            } else {
                woundedCells.push(hitPlayerCell);
                this.state.logs.push(this.createLogRecord("Enemy's shot: " + hitPlayerCell.xLabel + ':' + hitPlayerCell.yLabel + ' (wounded)'));
            }
            if (this.isWinShot(playerShips)) {
                Swal.fire(
                    'Enemy has won!',
                    'You are loser. Live with this.',
                    'error'
                );
                return {
                    isEnemyWon: true,
                    enemyLastShot: hitPlayerCell,
                    playerWoundedShipCells: woundedCells
                };
            }
            return this.enemyShot(woundedCells);
        }

        if (!playerShip) {
            this.state.logs.push(this.createLogRecord("Enemy's shot: " + hitPlayerCell.xLabel + ':' + hitPlayerCell.yLabel + ' (missed)'));
        }

        return {
            isEnemyWon: false,
            enemyLastShot: hitPlayerCell,
            playerWoundedShipCells: woundedCells
        };
    };

    startBattle = () => {
        // randomize enemyShips
        const gameData = this.randomizeBattleFieldWithShips();
        // this.state.enemyCells = gameData.cells;

        // random - who's first shot
        const firstMove = Math.floor(Math.random() * Math.floor(2));
        this.state.logs.push(this.createLogRecord('The battle has began!'));
        this.state.logs.push(this.createLogRecord('The first move: ' + (firstMove === 0 ? 'you' : 'enemy')));
        let enemyMove = {
            isEnemyWon: false,
            enemyLastShot: null,
            playerWoundedShipCells: []
        };
        if (firstMove === 1) {
            enemyMove = this.enemyShot([]);
        }

        this.setState({
            step: enemyMove.isEnemyWon ? STEP_FINAL : STEP_BATTLE,
            enemyCells: gameData.cells,
            enemyShips: gameData.ships,
            enemyLastShot: enemyMove.enemyLastShot,
            playerWoundedShipCells: enemyMove.playerWoundedShipCells,
            logs: this.state.logs
        });
    };

    randomizeBattleFieldWithShips = () => {
        const cells = initBattleFieldCells(BATTLE_FIELD_SIZE);
        return generateShips(cells);
    };

    randomizePlayersShips = () => {
        this.state.logs.push(this.createLogRecord("Randomize player's ships"));
        const gameData = this.randomizeBattleFieldWithShips();
        this.setState({
            playerCells: gameData.cells,
            playerShips: gameData.ships,
            step: STEP_READY_TO_START,
            logs: this.state.logs
        });
        // TODO: delete
        /*console.log("=======================================================");
        const rooms = getSpaciousRooms(gameData.cells, 4, function(cell) {
            return !cell.ship && !cell.isShipNeighbor;
        });
        console.log("getSpaciousRooms", rooms);*/
    };

    resetBattle = () => {
        this.setState({
            playerCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
            playerShips: [],
            playerLastShot: null,
            playerWoundedShipCells: [],
            enemyCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
            enemyShips: [],
            enemyLastShot: null,
            step: null,
            isReadyToStart: false,
            difficultyLevel: this.state.difficultyLevel,
            showShootHints: this.state.showShootHints,
            logs: [WELCOME_MESSAGE]
        });
    };

    createLogRecord = (text) => {
        return {
            time: new Date(),
            text: text
        }
    };

    renderLogs = () => {
        const result = [];
        let counter = 0;
        this.state.logs
            .sort(function (log1, log2) {
                return log2.time - log1.time;
            })
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
    };

    isWinShot = (ships) => {
        const liveShips = ships.filter(ship => {
            return ship.damage < ship.size;
        });
        return liveShips.length === 0;
    };

    onDifficultyLevelChanged = (level) => {
        // const level = parseInt(e.currentTarget.value);
        // console.log("level", level);
        this.setState({
            difficultyLevel: level
        })
    };

    onShowShootHintsChange = (e) => {
        const isShowHints = e.target.checked;
        // console.log("onShowShootHintsChange", isShowHints);
        this.setState({
            showShootHints: isShowHints
        })
    };

    render() {
        const isSetupStep = (this.state.step === null) || (this.state.step === STEP_READY_TO_START);
        const playerBattleFieldOpts = {
            isPlayer: true,
            stage: this.state.step,
            lastShot: this.state.enemyLastShot,
            recommendedShots: {
                shoots: [],
                strategy: null
            }
        };
        const enemyBattleFieldOpts = {
            isPlayer: false,
            stage: this.state.step,
            lastShot: this.state.playerLastShot,
            recommendedShots: this.state.showShootHints
                ? getRecommendedShots(this.state.enemyCells, this.state.enemyShips, this.state.difficultyLevel, 'player')
                : {
                    shoots: [],
                    strategy: null
                }
        };

        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-1"/>
                    <div className="col-sm-5 text-center text-warning">
                        <h4>Player</h4>
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
                            options={playerBattleFieldOpts}
                            onCellClick={this.playerCellSetup}
                        />
                    </div>
                    <div className="col-sm-5">
                        <BattleFieldRenderer
                            cells={this.state.enemyCells}
                            options={enemyBattleFieldOpts}
                            onCellClick={this.playerShot}
                        />
                    </div>
                    <div className="col-sm-1">
                        <ShipStatisticsRenderer ships={this.state.enemyShips} isPlayer={false}/>
                    </div>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-4">

                        <DifficultyLevelRenderer
                            level={this.state.difficultyLevel}
                            showShootHints={this.state.showShootHints}
                            onDifficultyChange={this.onDifficultyLevelChanged}
                            onShowShootHintsChange={this.onShowShootHintsChange}
                        />

                    </div>
                    <div className="col-sm-4 text-center btn-lg">
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
