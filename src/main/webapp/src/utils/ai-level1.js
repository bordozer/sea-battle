/*jshint esversion: 6 */
import React, {Component} from 'react';

import {getRandomHiddenCells} from 'src/utils/cells-utils';

export default class AiLevel1 extends Component {

    getCells = (cells) => {
        return getRandomHiddenCells(cells);
    }
}
