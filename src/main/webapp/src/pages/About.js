/*jshint esversion: 6 */
import React, {Component} from 'react';

import aboutImage from '../images/about.png';

export default class AboutPage extends Component {

    componentDidMount() {
        const homeImg = document.getElementById('about-img');
        homeImg.src = aboutImage;
    }

    render() {
        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-12 text-center">
                        <h4>About Battleship game project</h4>
                    </div>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-1"/>
                    <div className="col-sm-10">

                        <p>
                            My first ReactJS application. <br/>
                            <a href="https://github.com/bordozer/sea-battle" target="_blank">The source code on GitHub</a>.
                        </p>

                        <p>
                            <small>
                                Battleship (also Battleships or Sea Battle) is a strategy type guessing game for two players.
                                It is played on ruled grids on which each player's fleet of ships are marked.
                                The locations of the fleets are concealed from the other player.
                                Players alternate turns calling "shots" at the other player's ships, and the objective of the game
                                is to destroy the opposing player's fleet.
                                < br/>
                                <a href="https://en.wikipedia.org/wiki/Battleship_(game)" target="_blank">See more on WIKI</a>
                            </small>
                        </p>

                        <p className="text-center">
                            <img id='about-img' alt="Help" width='1000px'/>
                        </p>

                    </div>
                    <div className="col-sm-1"/>
                </div>
            </div>
        );
    }
}
