import React from "react";
import ReactDOM from "react-dom";

import AppRouter from 'src/router';
require("font-awesome-webpack");

import 'src/commons-headers'

ReactDOM.render(
    <AppRouter />,
    document.getElementById('js-page-context')
);

/*ReactDOM.render(
    <React.StrictMode>
        <MainPage />
    </React.StrictMode>,
    document.getElementById('js-page-context')
);*/

// import Swal from "sweetalert2";
// Swal.fire(
//     'Good job!',
//     'You clicked the button!',
//     'success'
// );
