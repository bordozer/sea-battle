import React, {Component} from 'react';

import Swal from "sweetalert2";

import BattleFieldRenderer from 'components/battle-field-renderer'

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const BATTLE_FIELD_SIZE = 10;
const SHIP_CELL_COUNT = 3;
const STEP_SETUP = 'STEP_SETUP';
const STEP_BATTLE = 'STEP_BATTLE';

export default class BattlePage extends Component {

    cells = (size) => {
        const cellItems = [];
        // console.log('cellItems1', cellItems);
        for (let h = size - 1; h >= 0; h--) {
            cellItems[h] = [];
            for (let v = size - 1; v >= 0; v--) {
                cellItems[h][v] = {
                    x: v,
                    y: h,
                    xLabel: X_AXE[v],
                    yLabel: h + 1,
                    isShip: false,
                    isHit: false
                };
            }
        }
        // console.log('cellItems2', cellItems);
        return cellItems;
    };

    state = {
        'cells': this.cells(BATTLE_FIELD_SIZE),
        'step': STEP_SETUP,
        'remainsShip': SHIP_CELL_COUNT
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

        const aCell = this.state.cells[cell.y][cell.x];
        aCell.isShip = !isShipInCell;
        this.setState({
            cells: this.state.cells,
            remainsShip: isShipInCell ? remainsShip + 1 : remainsShip - 1
        });
        // console.log("ownBattleFieldCellClicked", this.state.cells);
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
        this.setState({
            step: STEP_BATTLE
        });
    }

    render() {
        // console.log('BattlePage:', this.state);
        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-1"/>
                    <div className="col-sm-5 border-right border-light">
                        <BattleFieldRenderer cells={this.state.cells} onCellClick={this.ownBattleFieldCellClicked}/>
                    </div>
                    <div className="col-sm-5">
                        <BattleFieldRenderer cells={this.state.cells} onCellClick={this.anotherPlayerBattleFieldCellClicked}/>
                    </div>
                    <div className="col-sm-1"/>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-4"><h3>Remains ships: {this.state.remainsShip}</h3></div>
                    <div className="col-sm-4 text-center btn-lg">
                        <button
                            className="bg-primary"
                            onClick={this.startBattle}
                            disabled={this.state.remainsShip > 0 || this.state.step !== STEP_SETUP}>
                            Start
                        </button>
                    </div>
                    <div className="col-sm-4"/>
                </div>
            </div>
        );
    }
}
