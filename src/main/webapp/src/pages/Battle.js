import React, {Component} from 'react';

import Swal from "sweetalert2";

import {initBattleFieldCells} from 'src/utils/battle-field-utils'
import {getAliveShipsCount} from 'src/utils/ships-utils'
import {generateShips, markAllShipNeighborCellsAsKilled} from 'src/utils/ships-generator'

import {getEnemyShot, getRecommendedShots} from 'components/gunner-ai'

import BattleFieldRenderer from 'components/battle-field-renderer'
import DifficultyLevelRenderer from 'components/difficulty-level'
import ShipsStateRenderer from 'components/ships-state'
import LogsRenderer from 'components/logs-renderer'

const STEP_READY_TO_START = 'STEP_READY_TO_START';
const STEP_BATTLE = 'STEP_BATTLE';
const STEP_FINAL = 'STEP_FINAL';

const BATTLE_FIELD_SIZE = 10;

const WELCOME_MESSAGE = {
    time: new Date(),
    text: "Ready for a new fight? Setup your ships on left square (or use Randomize button) then press Start. Click on right square when your move",
    type: 'info'
};

export default class BattlePage extends Component {

    constructor(props) {
        super(props)
        this.state = this.getInitialState();
    }

    playerCellSetup = (cell) => {

    };

    startBattle = () => {
        // randomize enemyShips
        const gameData = this.randomizeBattleFieldWithShips();
        // this.state.enemyCells = gameData.cells;

        // random - who's first shot
        const firstMove = Math.floor(Math.random() * Math.floor(2));
        this.state.logs.push(this.createLogRecord('The battle has began! The first move: ' + (firstMove === 0 ? 'player' : 'enemy') + ". Kill'em all under Jolly Roger!"));
        if (firstMove === 1) {
            this.enemyMove();
        }

        this.setState({
            enemyCells: gameData.cells,
            enemyShips: gameData.ships,
            step: STEP_BATTLE,
            currentMove: firstMove === 0 ? 'player' : 'enemy',
            logs: this.state.logs
        });
    };

    playerShot = (cell) => {
        if (this.state.currentMove === 'enemy') {
            return;
        }
        console.log("-= PLAYER SHOOT =-");

        let step = this.state.step;
        let enemyLastShot = this.state.enemyLastShot;

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
            this.enemyMove();
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

            if (getAliveShipsCount(enemyShips) === 0) {
                Swal.fire(
                    'You have won!',
                    'You are just a lucky guy. Tou will have no chance next time.',
                    'success'
                );
                step = STEP_FINAL;
            }
        }

        this.setState({
            enemyCells: this.state.enemyCells,
            playerLastShot: cell,
            enemyLastShot: enemyLastShot,
            currentMove: enemyShip ? 'player' : 'enemy',
            logs: this.state.logs,
            step: step
        });
    };

    enemyShot = () => {
        console.log("-= ENEMY SHOOT =-");
        const playerCells = this.state.playerCells;
        const playerShips = this.state.playerShips;
        let playerWoundedShipCells = this.state.playerWoundedShipCells;
        let isEnemyWon = false;

        const hitPlayerCell = getEnemyShot(playerCells, playerShips, playerWoundedShipCells, this.state.difficultyLevel);

        hitPlayerCell.isHit = true;
        const playerShip = hitPlayerCell.ship;

        if (playerShip) {
            playerShip.damage++;
            if (playerShip.damage === playerShip.size) {
                // KILLED
                playerWoundedShipCells = [];
                this.state.logs.push(this.createLogRecord("Enemy's shot: " + hitPlayerCell.xLabel + ':' + hitPlayerCell.yLabel + ' (killed)'));
                markAllShipNeighborCellsAsKilled(playerShip, playerCells);
                if (getAliveShipsCount(playerShips) === 0) {
                    Swal.fire(
                        'Enemy has won!',
                        'You are loser. Live with this.',
                        'error'
                    );
                    isEnemyWon = true;
                }
            } else {
                // WOUNDED
                playerWoundedShipCells.push(hitPlayerCell);
                this.state.logs.push(this.createLogRecord("Enemy's shot: " + hitPlayerCell.xLabel + ':' + hitPlayerCell.yLabel + ' (wounded)'));
            }
            if (!isEnemyWon) {
                this.enemyMove();
            }
        }

        if (!playerShip) {
            this.state.logs.push(this.createLogRecord("Enemy's shot: " + hitPlayerCell.xLabel + ':' + hitPlayerCell.yLabel + ' (missed)'));
        }

        this.setState({
            step: isEnemyWon ? STEP_FINAL : this.state.step,
            enemyLastShot: hitPlayerCell,
            currentMove: playerShip ? 'enemy': 'player',
            playerWoundedShipCells: playerWoundedShipCells,
        });
    };

    enemyMove = () => {
        window.setTimeout(() => this.enemyShot(), 500);
    }

    randomizeBattleFieldWithShips = () => {
        const cells = initBattleFieldCells(BATTLE_FIELD_SIZE);
        return generateShips(cells);
    };

    onNewGameClick = () => {
        this.setState(this.getInitialState());

        this.state.logs.push(this.createLogRecord("Randomize player's ships"));
        const gameData = this.randomizeBattleFieldWithShips();
        this.setState({
            playerCells: gameData.cells,
            playerShips: gameData.ships,
            step: STEP_READY_TO_START,
            logs: this.state.logs
        });
    };

    getInitialState = () => {
        return {
            playerCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
            playerShips: [],
            playerLastShot: null,
            playerWoundedShipCells: [],
            enemyCells: initBattleFieldCells(BATTLE_FIELD_SIZE),
            enemyShips: [],
            enemyLastShot: null,
            step: null,
            currentMove: null,
            isReadyToStart: false,
            difficultyLevel: this.state ? this.state.difficultyLevel : 3, /* 1 - easy, 2 - medium, 3 - hard */
            showShootHints: this.state ? this.state.showShootHints : true, /* true/false */
            logs: [WELCOME_MESSAGE]
        }
    }

    createLogRecord = (text) => {
        return {
            time: new Date(),
            text: text
        }
    };

    onDifficultyLevelChanged = (level) => {
        this.setState({
            difficultyLevel: level
        })
    };

    onShowShootHintsChange = (e) => {
        const isShowHints = e.target.checked;
        this.setState({
            showShootHints: isShowHints
        })
    };

    componentDidMount() {
        window.addEventListener('load', this.onNewGameClick);
    }

    render() {
        const playerBattleFieldOpts = {
            isPlayer: true,
            stage: this.state.step,
            lastShot: this.state.enemyLastShot,
            currentMove: this.state.currentMove,
            highlightBattleArea: this.state.step === STEP_BATTLE && this.state.currentMove === 'enemy',
            recommendedShots: {
                shoots: [],
                strategy: null
            }
        };

        const shootHints = this.state.showShootHints && this.state.step === STEP_BATTLE
            ? getRecommendedShots(this.state.enemyCells, this.state.enemyShips, this.state.difficultyLevel)
            : {
                shoots: [],
                strategy: 'hits-are-disabled'
            };
        // console.log("shootHints", shootHints);
        const enemyBattleFieldOpts = {
            isPlayer: false,
            stage: this.state.step,
            lastShot: this.state.playerLastShot,
            recommendedShots: shootHints,
            highlightBattleArea: this.state.step === STEP_BATTLE && this.state.currentMove === 'player',
            currentMove: this.state.currentMove,
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
                        <ShipsStateRenderer ships={this.state.playerShips} isPlayer={true}/>
                    </div>
                    <div className={'col-sm-5' + (playerBattleFieldOpts.highlightBattleArea ? '' : ' disabledArea')} disabled={playerBattleFieldOpts.highlightBattleArea}>
                        <BattleFieldRenderer
                            cells={this.state.playerCells}
                            options={playerBattleFieldOpts}
                            onCellClick={this.playerCellSetup}
                        />
                    </div>
                    <div className={'col-sm-5' + (enemyBattleFieldOpts.highlightBattleArea ? '' : ' disabledArea')} disabled={enemyBattleFieldOpts.highlightBattleArea}>
                        <BattleFieldRenderer
                            cells={this.state.enemyCells}
                            options={enemyBattleFieldOpts}
                            onCellClick={this.playerShot}
                        />
                    </div>
                    <div className="col-sm-1">
                        <ShipsStateRenderer ships={this.state.enemyShips} isPlayer={false}/>
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
                            className="bg-primary button-rounded"
                            onClick={this.onNewGameClick}>
                            New game
                        </button>
                        <button
                            className="bg-primary button-rounded"
                            onClick={this.startBattle}
                            disabled={this.state.step !== STEP_READY_TO_START}>
                            Start
                        </button>
                    </div>
                    <div className="col-sm-4"/>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-12">
                        <LogsRenderer logs={this.state.logs}/>
                    </div>
                </div>

            </div>
        );
    }
}
