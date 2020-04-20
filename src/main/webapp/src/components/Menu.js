import React, {Component} from 'react';

export default class Menu extends Component {
    render() {
        return (
            <ul>
                <li><a href="/battle">New game</a></li>
                <li><a href="/scores">Scores</a></li>
            </ul>
        );
    }
}
