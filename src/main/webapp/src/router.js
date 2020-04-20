import React from "react";
import {BrowserRouter as Router, Link, Route, Switch, useRouteMatch} from "react-router-dom";

import MainPage from 'src/pages/MainPage'
import BattlePage from 'src/pages/Battle'
import ScoresPage from 'src/pages/Scores'

export default function AppRouter() {

    return (
        <Router>
            <div>

                <div className="row bg-light">
                    <div className="col-sm-4 text-center">
                        <OldSchoolMenuLink
                            activeOnlyWhenExact={true}
                            to="/"
                            label="Main page"
                        />
                    </div>
                    <div className="col-sm-4 text-center">
                        <OldSchoolMenuLink
                            activeOnlyWhenExact={true}
                            to="/battle"
                            label="Battle"
                        />
                    </div>
                    <div className="col-sm-4 text-center">
                        <OldSchoolMenuLink
                            activeOnlyWhenExact={true}
                            to="/scores"
                            label="Scores"
                        />
                    </div>
                </div>

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

function OldSchoolMenuLink({label, to, activeOnlyWhenExact}) {
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact
    });

    return (
        <div>
            <h4>
                <Link
                    to={to}
                    style={{textDecoration: 'none'}}
                    class={match ? "active text-danger" : "text-dark"}
                >
                    {label}
                </Link>
            </h4>
        </div>
    );
}


