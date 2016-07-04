import {Map, List, fromJS} from 'immutable';
import {combineReducers} from 'redux';

import {
    USERS_REQUEST,
    USERS_SUCCESS,
    USERS_FAILURE,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAILURE
} from '../actions';

function mergeEntities(namespace, state, action) {
    if (action.res && action.res.entities && action.res.entities[namespace]) {
        return state.mergeDeep(action.res.entities[namespace]);
    }
    return state;
}

const userEntityReducers = {
    [USERS_SUCCESS]: (state, action) => {
        return mergeEntities('users', state, action);
    },
    [USER_UPDATE_REQUEST]: (state, action) => {
        const {user} = action;
        return state.mergeIn([user.uid + ''], {isUpdating: true});
    },
    [USER_UPDATE_SUCCESS]: (state, action) => {
        const {user} = action.res;
        return state.set(user.uid + '', fromJS(user));
    },
    [USER_UPDATE_FAILURE]: (state, action) => {
        
    }
}

function userEntities(state = Map(), action) {
    const reducer = userEntityReducers[action.type] || (state => state);
    return reducer(state, action);
}

function groupEntities(state = Map(), action) {
    return mergeEntities('groups', state, action);
}

export default combineReducers({users: userEntities, groups: groupEntities});
