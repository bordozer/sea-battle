import React, {Component} from 'react';

export default class AboutPage extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="col-sm-12 text-muted mt-10">
                            <p>
                                My first ReactJS application
                            </p>
                            <p>
                                <a href="https://github.com/bordozer/sea-battle" target="_blank">
                                    The source code on GitHub
                                </a>
                            </p>
                            <p>
                                <a href="https://en.wikipedia.org/wiki/Battleship_(game)" target="_blank">
                                    How to play - WIKI
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
