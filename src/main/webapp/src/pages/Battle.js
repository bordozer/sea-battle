import React, {Component} from 'react';

import BattleFieldRenderer from 'components/battle-field-renderer'

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const SIZE = 10;
const STEP_SETUP = 'STEP_SETUP';
const STEP_BATTLE = 'STEP_BATTLE';

export default class BattlePage extends Component {

    cells = ({size}) => {
        const cellItems = [];
        // console.log('cellItems1', cellItems);
        for (let h = SIZE - 1; h >= 0; h--) {
            cellItems[h] = [];
            for (let v = SIZE - 1; v >= 0; v--) {
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
        'cells': this.cells(SIZE),
        'step': STEP_SETUP
    };

    startBattle = () => {
        this.setState({
            step: STEP_BATTLE
        });
        console.log("The battle has began");
    }

    cellShip = (cell) => {
        const aCell = this.state.cells[cell.y][cell.x];
        aCell.isShip = !aCell.isShip;
        this.setState({
            cells: this.state.cells
        });
        console.log("Set ship: cells", this.state.cells);
    }

    cellHit = (cell) => {
        /*this.setState({
            step: 'BATTLE'
        });*/
        console.log("Set hit", cell);
    }

    render() {
        // console.log('BattlePage:', this.state);
        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-1"/>
                    <div className="col-sm-5 border-right border-light">
                        <BattleFieldRenderer cells={this.state.cells} onCellClick={this.cellShip}/>
                    </div>
                    <div className="col-sm-5">
                        <BattleFieldRenderer cells={this.state.cells} onCellClick={this.cellHit}/>
                    </div>
                    <div className="col-sm-1"/>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-4"/>
                    <div className="col-sm-4 text-center btn-lg">
                        <button className="bg-primary" onClick={this.startBattle}>Start</button>
                    </div>
                    <div className="col-sm-4"/>
                </div>
            </div>
        );
    }
}
