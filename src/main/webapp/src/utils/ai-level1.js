import React, {Component} from 'react';

import {getRandomHiddenCell} from 'src/utils/cells-utils'

export default class Header extends Component {

    getShoot = (cells) => {
        return getRandomHiddenCell(cells);
    }
}
