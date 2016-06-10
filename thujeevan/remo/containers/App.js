import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import NavBar from '../containers/NavBar';

const App = ({children}) => {
    return (
        <div>
            <NavBar />
            <div className="container">{children}</div>
        </div>
    )
}

export default App;