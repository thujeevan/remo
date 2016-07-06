import {Map, List, fromJS, Record} from 'immutable';
import {v4} from 'node-uuid';

import {
    LOGIN_FAILURE,
    USERS_FAILURE, 
    USER_UPDATE_FAILURE, 
    REMOVE_ERROR,
    CLEAR_ERRORS
} from '../actions';

import {
    BadRequestError, 
    InternalServerError, 
    UnauthorizedError, 
    NoPermissionError, 
    ValidationError, 
    NotFoundError
} from '../errors';

const errorsMap = {
    400: BadRequestError,
    401: UnauthorizedError,
    403: NoPermissionError,
    404: NotFoundError,
    422: ValidationError,
    500: InternalServerError
}

function shared(state, action) {
    const {error: {status, res}} = action;
    const err = new errorsMap[status](res);
    return state.unshift(err);
}

const errorReducers = {
    [LOGIN_FAILURE]: shared,
    [USERS_FAILURE]: shared,
    [USER_UPDATE_FAILURE]: shared,
    [REMOVE_ERROR]: (state, action) => {
        const {error} = action;
        return state.remove(state.indexOf(error));
    },
    [CLEAR_ERRORS]: (state, action) => {
        return state.clear();
    }
}

function reducer(state = List(), action) {
    const errorReducer = errorReducers[action.type] || (state => state);
    return errorReducer(state, action);
}

export default reducer;