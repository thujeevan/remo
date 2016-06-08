import {Map, List, fromJS} from 'immutable';
import {combineReducers} from 'redux';

import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST} from '../actions';

export const AUTH_INITIAL_STATE = fromJS({
    isFetching: false, 
    isAuthenticated: false
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
        return state.merge({
            isFetching: false,
            isAuthenticated: true,
            session
        });
    },
    [LOGIN_FAILURE]: (state, {message}) => {
        return state.merge({
            isFetching: false,
            isAuthenticated: false,
            message
        });
    }
};

function auth(state = AUTH_INITIAL_STATE, action) {    
    let reducer = authReducers[action.type] || (state => state);
    return reducer(state, action);
}

const rootReducer = combineReducers({auth});
export default rootReducer;