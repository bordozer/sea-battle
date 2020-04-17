import React from "react";
import ReactDOM from "react-dom";

import 'src/common'

import Menu from "components/Menu";

// import Swal from "sweetalert2";
// Swal.fire(
//     'Good job!',
//     'You clicked the button!',
//     'success'
// );

ReactDOM.render(<Menu/>, document.getElementById("menu"));
ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
);
