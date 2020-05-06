import React, {Component} from 'react';

import Swal from "sweetalert2";

import {initBattleFieldCells} from 'src/utils/battle-field-utils'
import {getAliveShipsCount} from 'src/utils/ships-utils'
import {generateShips, markAllShipNeighborCellsAsKilled} from 'src/utils/ships-generator'

import {getEnemyShot, getRecommendedShots} from 'components/gunner-ai'

import BattleFieldRenderer from 'components/battle-field-renderer'
import GameConfigRenderer from 'components/game-config-renderer'
import ShipsStateRenderer from 'components/ships-state'
import LogsRenderer from 'components/logs-renderer'

const STEP_READY_TO_START = 'STEP_READY_TO_START';
const STEP_BATTLE = 'STEP_BATTLE';
const STEP_FINAL = 'STEP_FINAL';

const BATTLE_FIELD_SIZE = 10;

export default class BattlePage extends Component {

    constructor(props) {
        super(props)
        this.state = this.getInitialState(null);
    }

    playerCellSetup = (cell) => {

    };

    startBattle = () => {
        // random - who's first shot. 0 - player, 1 - enemy
        const firstMove = Math.floor(Math.random() * Math.floor(2));
        const logs = [this.createLogRecord('The battle has began! The first move: ' + (firstMove === 0 ? 'player' : 'enemy'))];
        if (firstMove === 1) {
            this.enemyMove();
        }

        const gameData = this.randomizeBattleFieldWithShips();
        this.setState({
            enemy: {
                cells: gameData.cells,
                ships: gameData.ships,
                lastShot: null,
                damagedShipCells: [],
                points: this.state.enemy.points
            },
            gameplay: {
                step: STEP_BATTLE,
                currentMove: firstMove === 0 ? 'player' : 'enemy',
                winner: null
            },
            logs: logs
        });
    };

    playerShot = (cell) => {
        if (this.state.gameplay.currentMove === 'enemy') {
            return;
        }

        const enemyCells = this.state.enemy.cells;
        const enemyShips = this.state.enemy.ships;

        let isPlayerWin = false;
        const enemyCell = enemyCells[cell.y][cell.x];

        if (enemyCell.isHit) {
            this.state.logs.push(this.createLogRecord("Cell " + cell.xLabel + cell.yLabel + ' has already been hit. Chose another one.'));
            this.setState({
                logs: this.state.logs
            });
            return;
        }
        if (enemyCell.isKilledShipNeighborCell) {
            this.state.logs.push(this.createLogRecord("Cell " + cell.xLabel + cell.yLabel + ' is a neighbor of killed ship. Chose another one.'));
            this.setState({
                logs: this.state.logs
            });
            return;
        }

        enemyCell.isHit = true;

        let enemyDamagedShipCells = this.state.enemy.damagedShipCells;
        const enemyShip = enemyCell.ship;

        // MISSED
        if (!enemyShip) {
            this.state.logs.push(this.createLogRecord("Player: " + cell.xLabel + cell.yLabel + ' - missed'));
            this.enemyMove();
        }

        // HIT a enemyShip
        if (enemyShip) {
            enemyShip.damage++;
            if (enemyShip.damage === enemyShip.size) {
                this.state.logs.push(this.createLogRecord("Player: " + cell.xLabel + cell.yLabel + ' - killed ' + '#'.repeat(enemyShip.size)));
                markAllShipNeighborCellsAsKilled(enemyShip, enemyCells);
                enemyDamagedShipCells = [];
            } else {
                this.state.logs.push(this.createLogRecord("Player: " + cell.xLabel + cell.yLabel + ' - damaged'));
                enemyDamagedShipCells.push(enemyCell);
            }

            isPlayerWin = getAliveShipsCount(enemyShips) === 0;
            if (isPlayerWin) {
                Swal.fire(
                    'You have won',
                    "You're just lucky. You will have no chance next time",
                    'success'
                );
                this.state.logs.push(this.createLogRecord('Player won'));
            }
        }

        this.setState({
            player: {
                cells: this.state.player.cells,
                ships: this.state.player.ships,
                lastShot: cell,
                damagedShipCells: this.state.player.damagedShipCells,
                points: isPlayerWin ? this.state.player.points + 1 : this.state.player.points
            },
            enemy: {
                cells: this.state.enemy.cells,
                ships: this.state.enemy.ships,
                lastShot: this.state.enemy.lastShot,
                damagedShipCells: enemyDamagedShipCells,
                points: this.state.enemy.points
            },
            gameplay: {
                step: isPlayerWin ? STEP_FINAL : this.state.gameplay.step,
                currentMove: isPlayerWin ? null : (enemyShip ? 'player' : 'enemy'),
                winner: isPlayerWin ? 'player': null
            }
        });
    };

    enemyShot = () => {
        const playerCells = this.state.player.cells;
        const playerShips = this.state.player.ships;
        // console.log("this.state.player", this.state.player);

        let playerDamagedShipCells = this.state.player.damagedShipCells;
        let isEnemyWin = false;

        const hitPlayerCell = getEnemyShot(playerCells, playerShips, playerDamagedShipCells, this.state.config.difficulty);

        hitPlayerCell.isHit = true;
        const playerShip = hitPlayerCell.ship;

        if (playerShip) {
            playerShip.damage++;
            if (playerShip.damage === playerShip.size) {
                // KILLED
                playerDamagedShipCells = [];
                this.state.logs.push(this.createLogRecord("Enemy: " + hitPlayerCell.xLabel + hitPlayerCell.yLabel + ' - killed ' + '#'.repeat(playerShip.size)));
                markAllShipNeighborCellsAsKilled(playerShip, playerCells);
                isEnemyWin = getAliveShipsCount(playerShips) === 0;
                if (isEnemyWin) {
                    Swal.fire(
                        'Enemy has won!',
                        'You are loser. Live with this.',
                        'error'
                    );
                }
            } else {
                // WOUNDED
                playerDamagedShipCells.push(hitPlayerCell);
                this.state.logs.push(this.createLogRecord("Enemy: " + hitPlayerCell.xLabel + hitPlayerCell.yLabel + ' - damaged'));
            }
            if (!isEnemyWin) {
                this.enemyMove();
            } else {
                this.state.logs.push(this.createLogRecord('Enemy won'));
            }
        }

        if (!playerShip) {
            this.state.logs.push(this.createLogRecord("Enemy: " + hitPlayerCell.xLabel + hitPlayerCell.yLabel + ' - missed'));
        }

        this.setState({
            player: {
                cells: this.state.player.cells,
                ships: this.state.player.ships,
                lastShot: this.state.player.lastShot,
                damagedShipCells: playerDamagedShipCells,
                points: this.state.player.points
            },
            enemy: {
                cells: this.state.enemy.cells,
                ships: this.state.enemy.ships,
                lastShot: hitPlayerCell,
                damagedShipCells: this.state.enemy.damagedShipCells,
                points: isEnemyWin ? this.state.enemy.points + 1 : this.state.enemy.points
            },
            gameplay: {
                step: isEnemyWin ? STEP_FINAL : this.state.gameplay.step,
                currentMove: isEnemyWin ? null : (playerShip ? 'enemy' : 'player'),
                winner: isEnemyWin ? 'enemy' : null
            }
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
        this.setState((state) => {
            return this.getInitialState(state)
        });
    };

    getInitialState = (state) => {
        const gameData = this.randomizeBattleFieldWithShips();
        return {
            player: {
                cells: gameData.cells,
                ships: gameData.ships,
                lastShot: null,
                damagedShipCells: [],
                points: state ? state.player.points : 0
            },
            enemy: {
                cells: initBattleFieldCells(BATTLE_FIELD_SIZE),
                ships: [],
                lastShot: null,
                damagedShipCells: [],
                points: state ? state.enemy.points : 0
            },
            config: {
                showShotHints: state ? state.config.showShotHints : true,
                difficulty: state ? state.config.difficulty : 3, /* 1 - easy, 2 - medium, 3 - hard */
            },
            gameplay: {
                step: STEP_READY_TO_START,
                currentMove: null,
                winner: null
            },
            logs: [this.createLogRecord("New game is initialized. Click START button when ready.")]
        }
    }

    createLogRecord = (text) => {
        return {
            time: new Date(),
            text: text
        }
    };

    onDifficultyChange = (difficulty) => {
        this.setState({
            config: {
                showShotHints: this.state.config.showShotHints,
                difficulty: difficulty
            }
        })
    };

    onShowShotHintsChange = (e) => {
        const isShowHints = e.target.checked;
        this.setState({
            config: {
                showShotHints: isShowHints,
                difficulty: this.state.config.difficulty
            }
        })
    };

    componentDidMount() {

    }

    componentDidUpdate() {
        // console.log("this.state", this.state);
    }

    render() {
        const step = this.state.gameplay.step;
        const currentMove = this.state.gameplay.currentMove;
        const difficulty = this.state.config.difficulty;

        const playerBattleFieldOpts = {
            isPlayer: true,
            stage: step,
            lastShot: this.state.enemy.lastShot,
            currentMove: currentMove,
            highlightBattleArea: step === STEP_BATTLE && currentMove === 'enemy',
            recommendedShots: {
                shots: [],
                strategy: null
            }
        };

        const shotHints =  this.state.config.showShotHints && step === STEP_BATTLE
            ? getRecommendedShots(this.state.enemy.cells, this.state.enemy.ships, this.state.enemy.damagedShipCells, difficulty)
            : {
                shots: [],
                strategy: 'hits-are-disabled'
            };
        // console.log("shotHints", shotHints);
        const enemyBattleFieldOpts = {
            isPlayer: false,
            stage: step,
            lastShot: this.state.player.lastShot,
            recommendedShots: shotHints,
            highlightBattleArea: step === STEP_BATTLE && currentMove === 'player',
            currentMove: currentMove,
        };

        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-1">
                        <ShipsStateRenderer
                            ships={this.state.player.ships}
                            isPlayer={true}
                            winner={this.state.gameplay.winner}
                            points={this.state.player.points}
                        />
                    </div>
                    <div className={'col-sm-5' + (playerBattleFieldOpts.highlightBattleArea ? '' : ' disabledArea')} disabled={playerBattleFieldOpts.highlightBattleArea}>
                        <BattleFieldRenderer
                            cells={this.state.player.cells}
                            options={playerBattleFieldOpts}
                            onCellClick={this.playerCellSetup}
                        />
                    </div>
                    <div className={'col-sm-5' + (enemyBattleFieldOpts.highlightBattleArea ? '' : ' disabledArea')} disabled={enemyBattleFieldOpts.highlightBattleArea}>
                        <BattleFieldRenderer
                            cells={this.state.enemy.cells}
                            options={enemyBattleFieldOpts}
                            onCellClick={this.playerShot}
                        />
                    </div>
                    <div className="col-sm-1">
                        <ShipsStateRenderer
                            ships={this.state.enemy.ships}
                            isPlayer={false}
                            winner={this.state.gameplay.winner}
                            points={this.state.enemy.points}
                        />
                    </div>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-4">

                        <GameConfigRenderer
                            difficulty={difficulty}
                            showShotHints={this.state.config.showShotHints}
                            onDifficultyChange={this.onDifficultyChange}
                            onShowShotHintsChange={this.onShowShotHintsChange}
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
                            disabled={this.state.gameplay.step !== STEP_READY_TO_START}>
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
