import React from 'react';

import NavBar from '../containers/NavBar';
import Alert from '../containers/Alert';

const App = ({children}) => {
    return (
        <div>
            <Alert />
            <NavBar />
            <div className="container-fluid">{children}</div>
        </div>
    )
}

export default App;