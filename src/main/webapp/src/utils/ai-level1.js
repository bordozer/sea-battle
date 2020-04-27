import React from 'react';

import {getRandomHiddenCells} from 'src/utils/cells-utils'
import {randomElement} from 'src/utils/random-utils'

export const getShot = () => {
    randomElement(getRandomHiddenCells(cells));
}
