/*jshint esversion: 6 */
import React from "react";
import ReactDOM from "react-dom";

import AppRouter from 'src/router';
require("font-awesome-webpack");

import 'src/commons-headers';

ReactDOM.render(
    <AppRouter />,
    document.getElementById('js-page-context')
);
