import {CALL_API, API_ROOT} from '../middleware/api';
import {Schemas} from '../middleware/schema';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

function requestLogin(creds) {
    return {
        type: LOGIN_REQUEST,
        creds
    };
}

function receiveLogin({session}) {
    return {
        type: LOGIN_SUCCESS,
        session
    };
}

function loginError({message}) {
    return {
        type: LOGIN_FAILURE,
        message
    };
} 

export function loginUser(creds) {
    let config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session: {
                username: creds.username, 
                password: creds.password
            }
        })
    };
    
    return dispatch => {
        dispatch(requestLogin(creds));
        return fetch(`${API_ROOT}/session/current`, config).then(res => {
            return res.json().then(json => ({res, json}));
        }).then(({res, json}) => {
            if (!res.ok) {
                dispatch(loginError(json));
                return Promise.reject(json);
            }
            
            localStorage.setItem('remo-session', json);
            dispatch(receiveLogin(json));
        });
    }
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
        isAuthenticated: true,
        isFetching: true
    };
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        isAuthenticated: false,
        isFetching: false
    }
}

export function logoutUser() {
    return dispatch => {
        dispatch(requestLogout());
        localStorage.removeItem('remo-session');
        dispatch(receiveLogout());
    }
}

export function fetchData() {
    return {
        [CALL_API]: {
            types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
            endpoint: `/sesssion/current`,
            schema: Schemas.SESSION
        },
        isAuthenticated: false,
        isFetching: false,
        creds
    }
}