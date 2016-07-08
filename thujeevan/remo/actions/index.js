import {CALL_API, API_ROOT, METHOD_PUT, METHOD_POST} from '../middleware/api';
import {Schemas, options as normalizeOptions} from '../middleware/schema';
import {saveData, SESSION_KEY} from '../storage/localStorage';

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
        message: `Successfully logged in as ${session.full_name}`,
        session
    };
}

function loginError(error) {
    return {
        type: LOGIN_FAILURE,
        error
    };
} 

// TODO: re-factor
// possible candidate to generalize with api middleware
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
        return fetch(`${API_ROOT}/sessions/current`, config).then(res => {
            return res.json().then(json => ({res, json}));
        }).then(({res, json}) => {
            if (!res.ok) {
                const {status} = res;
                return Promise.reject({status, ...({res: json})});
            }
            const {session} = json;
            saveData(SESSION_KEY, session);
            dispatch(receiveLogin(json));
        }).catch(error => dispatch(loginError(error)));
    }
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function requestLogout() {
    return {
        type: LOGOUT_REQUEST
    };
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        message: `Successfully logged out`
    }
}

export function logoutUser() {
    return dispatch => {
        dispatch(requestLogout());
        localStorage.removeItem(SESSION_KEY);
        dispatch(receiveLogout());
    }
}

export const USERS_REQUEST = 'USERS_REQUEST';
export const USERS_SUCCESS = 'USERS_SUCCESS';
export const USERS_FAILURE = 'USERS_FAILURE';

export function fetchUsers(query = {}) {
    let endpoint = '/users';
    endpoint += '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    
    const {USERS_SCHEMA} = Schemas;
    const {USER_SCHEMA: options} = normalizeOptions;
    
    return {
        [CALL_API]: {
            types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE],
            endpoint,
            schema: USERS_SCHEMA,
            options 
        }
    }
}

export const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST';
export const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
export const USER_UPDATE_FAILURE = 'USER_UPDATE_FAILURE';

export function updateUser(user) {
    const endpoint = `/users/${user.uid}`;
    
    const {USER_SCHEMA} = Schemas;
    const {USER_SCHEMA: options} = normalizeOptions;
    
    return {
        [CALL_API]: {
            method: METHOD_PUT,
            types: [USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE],
            endpoint,
            schema: USER_SCHEMA,
            options 
        },
        user
    }
}

export const REMOVE_ALERT = 'REMOVE_ALERT';
export const CLEAR_ALERTS = 'CLEAR_ALERTS';

export function removeAlert(error) {
    return {
        type: REMOVE_ALERT,
        error
    }
}

export function clearAlerts() {
    return {
        type: CLEAR_ALERTS
    }
}