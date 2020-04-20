import React, {Component} from 'react';

import BattleFieldRenderer from 'components/battle-field-renderer'

const X_AXE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
const SIZE = 12;

export default class BattlePage extends Component {

    cells = ({size}) => {
        const cellItems = [];
        // console.log('cellItems1', cellItems);
        for (let y = 0; y < SIZE; y++) {
            cellItems[y] = [];
            for (let x = 0; x < SIZE; x++) {
                cellItems[y][x] = {
                    x: x,
                    y: y,
                    xLabel: X_AXE[x],
                    yLabel: y + 1
                };
            }
        }
        // console.log('cellItems2', cellItems);
        return cellItems;
    };

    state = {
        'cells': this.cells(SIZE)
    };

    render() {
        // console.log('BattlePage:', this.state.cells);
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <BattleFieldRenderer cells={this.state.cells}/>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
            </div>
        );
    }
}
