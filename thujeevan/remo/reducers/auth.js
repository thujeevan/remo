import {Map, List, fromJS} from 'immutable';
import {loadData, SESSION_KEY} from '../storage/localStorage';

import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS} from '../actions';

const session = loadData(SESSION_KEY);
export const AUTH_INITIAL_STATE = fromJS({
    isFetching: false, 
    isAuthenticated: session && session.token ? true : false,
    session
});

const authReducers = {
    [LOGIN_REQUEST]: (state, {creds}) => {
        return state.remove('session').remove('message').merge({
            isFetching: true,
            isAuthenticated: false,
            creds
        });
    },
    [LOGIN_SUCCESS]: (state, {session}) => {
        return state.remove('creds').merge({
            isFetching: false,
            isAuthenticated: true,
            session
        });
    },
    [LOGIN_FAILURE]: (state, action) => {
        return state.merge({
            isFetching: false,
            isAuthenticated: false
        });
    },
    [LOGOUT_REQUEST]: (state) => {
        return state.merge({
            isFetching: true
        });
    },
    [LOGOUT_SUCCESS]: (state) => {
        return state.merge({
            isFetching: false,
            isAuthenticated: false,
            session: {}
        });
    },
};

export default function auth(state = AUTH_INITIAL_STATE, action) {
    let reducer = authReducers[action.type] || (state => state);
    return reducer(state, action);
}

export const getAuth = (state) => {
    return state.toJS();
}