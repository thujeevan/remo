import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import NavBar from '../components/NavBar';
import {getAuth} from '../reducers/auth';
import {logoutUser} from '../actions';

function mapStateToProps(state, ownProps) {
    return { auth: getAuth(state.auth) };
}

export default withRouter(connect(mapStateToProps, {logoutUser})(NavBar));