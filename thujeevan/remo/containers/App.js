import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import NavBar from '../components/NavBar';

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const {children} = this.props;
        
        return (
            <div>
                <NavBar />
                <div className="container">{children}</div>
            </div>
        )
    }
}
