import {List} from 'immutable';
import {v4} from 'node-uuid';

import {
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    USERS_FAILURE, 
    USER_UPDATE_FAILURE, 
    REMOVE_ALERT,
    CLEAR_ALERTS
} from '../actions';

import {
    BadRequestError, 
    InternalServerError, 
    UnauthorizedError, 
    NoPermissionError, 
    ValidationError, 
    NotFoundError
} from '../alerts/error';

import {Success} from '../alerts/alert';

const errorsMap = {
    400: BadRequestError,
    401: UnauthorizedError,
    403: NoPermissionError,
    404: NotFoundError,
    422: ValidationError,
    500: InternalServerError
}

function sharedErrorAlert(state, action) {
    const {error: {status, res}} = action;
    const err = new errorsMap[status]({status, ...res});
    return state.unshift(err);
}

function sharedSuccessAlert(state, {message}) {
    const alert = new Success({message});
    return state.unshift(alert);
}

const errorReducers = {
    [LOGIN_FAILURE]: sharedErrorAlert,
    [USERS_FAILURE]: sharedErrorAlert,
    [USER_UPDATE_FAILURE]: sharedErrorAlert,
    [LOGIN_SUCCESS]: sharedSuccessAlert,
    [LOGOUT_SUCCESS]: sharedSuccessAlert,
    [REMOVE_ALERT]: (state, action) => {
        const {error} = action;
        return state.remove(state.indexOf(error));
    },
    [CLEAR_ALERTS]: (state, action) => {
        return state.clear();
    }
}

function reducer(state = List(), action) {
    const errorReducer = errorReducers[action.type] || (state => state);
    return errorReducer(state, action);
}

export default reducer;

export const getAlerts = (state => state);