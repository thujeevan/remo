import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import {loginUser} from '../actions';
import LoginPage from '../components/LoginPage';

function mapStateToProps(state, ownProps) {
    const isFetching = state.auth.get('isFetching');
    return { isFetching };
}

const LoginPageContainer = withRouter(connect(
    mapStateToProps, 
    {loginUser}
)(LoginPage));

LoginPageContainer.onEnter = (store, nextState, replace) => {
    const {auth} = store.getState();
    if (auth.get('isAuthenticated')) {
        return replace('/');
    }
};

export default LoginPageContainer;