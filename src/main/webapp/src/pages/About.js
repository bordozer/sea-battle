import React, {Component} from 'react';

export default class AboutPage extends Component {

    render() {
        return (
            <div>
                <div className="row mt-10">
                    <div className="col-sm-12 text-center">
                        <h4>About Battleship game project</h4>
                    </div>
                </div>

                <div className="row mt-10">
                    <div className="col-sm-2"/>
                    <div className="col-sm-8">

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

                    </div>
                    <div className="col-sm-2"/>
                </div>
            </div>
        );
    }
}
