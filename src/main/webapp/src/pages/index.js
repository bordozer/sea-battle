import React from "react";
import ReactDOM from "react-dom";

import AppRouter from 'src/router';
import MainPage from 'components/MainPage'

import 'src/commons-headers'

// ReactDOM.render(<Menu/>, document.getElementById("js-main-menu"));
ReactDOM.render(
    <AppRouter />,
    document.getElementById('js-main-menu')
);

ReactDOM.render(
    <React.StrictMode>
        <MainPage />
    </React.StrictMode>,
    document.getElementById('js-page-context')
);

// import Swal from "sweetalert2";
// Swal.fire(
//     'Good job!',
//     'You clicked the button!',
//     'success'
// );
