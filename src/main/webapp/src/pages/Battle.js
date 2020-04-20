import React, {Component} from 'react';

import BattleFieldRenderer from 'components/battle-field-renderer'

const X_AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const SIZE = 10;

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
                    yLabel: h + 1
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
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                        <BattleFieldRenderer cells={this.state.cells}/>
                    </div>
                    <div className="col-sm-2" />
                </div>
            </div>
        );
    }
}
