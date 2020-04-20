import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";

import MainPage from 'components/MainPage'
import BattlePage from 'components/Battle'
import ScoresPage from 'components/Scores'

export default function AppRouter() {

    return (
        <Router>
            <div>

                <div className="row">
                    <div className="col-sm-4 text-center">
                        <Link to="/">Home</Link>
                    </div>
                    <div className="col-sm-4 text-center">
                        <Link to="/battle">Battle!</Link>
                    </div>
                    <div className="col-sm-4 text-center">
                        <Link to="/scores">Scores</Link>
                    </div>
                </div>

                <hr/>

                {}

                <Switch>
                    <Route exact path="/">
                        <MainPage/>
                    </Route>
                    <Route path="/battle">
                        <BattlePage/>
                    </Route>
                    <Route path="/scores">
                        <ScoresPage/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
}

function Battle() {
    return (
        <div>
            <h2>Battle</h2>
        </div>
    );
}

function Scores() {
    return (
        <div>
            <h2>Scores</h2>
        </div>
    );
}


