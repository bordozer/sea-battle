/* jshint esversion: 6 */
import React from "react";
import {BrowserRouter as Router, Link, Route, Switch, useRouteMatch} from "react-router-dom";

import BattlePage from 'src/pages/Battle';
import AboutPage from 'src/pages/About';

export default function AppRouter() {

    return (
        <Router>
            <div>

                <div className="row bg-light">
                    <div className="col-sm-6 text-center">
                        <OldSchoolMenuLink
                            activeOnlyWhenExact={true}
                            to="/"
                            label="Battleship game"
                        />
                    </div>
                    <div className="col-sm-6 text-center">
                        <OldSchoolMenuLink
                            activeOnlyWhenExact={true}
                            to="/about"
                            label="About"
                        />
                    </div>
                </div>

                {}

                <Switch>
                    <Route exact path="/">
                        <BattlePage/>
                    </Route>
                    <Route exact path="/about">
                        <AboutPage/>
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
            <Link
                to={to}
                style={{textDecoration: 'none'}}
                className={match ? "active text-danger" : "text-dark"}
            >
                {label}
            </Link>
        </div>
    );
}


