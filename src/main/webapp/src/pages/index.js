import React from "react";
import ReactDOM from "react-dom";

import 'src/commons-headers'
import App from 'components/App'

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('js-page-context')
);

// import Menu from "components/Menu";

// import Swal from "sweetalert2";
// Swal.fire(
//     'Good job!',
//     'You clicked the button!',
//     'success'
// );

/*ReactDOM.render(<Menu/>, document.getElementById("menu"));
ReactDOM.render(
    <h1>Hello, world again!</h1>,
    document.getElementById('root')
);*/
