import {normalize} from 'normalizr';
import 'isomorphic-fetch';

export const API_ROOT = "http://localhost:3000";

function callApi(endpoint, schema) {
    const fullURL = (endpoint.indexOf(API_ROOT) === -1) ? `${API_ROOT}${endpoint}` : endpoint;
    
    return fetch(fullURL).then(res => res.json().then(json => ({json, res}))).then(({json, res}) => {
        if (!res.ok) {
            return Promise.reject(json);
        }
        
        return Object.assign({}, normalize(json, schema));
    });
};

export const CALL_API = Symbol('Call API');

export default store => next => action => {
    const callAPI = action[CALL_API];
    if (!callAPI) {
        return next(action);
    }
    
    let {endpoint} = callAPI;
    const {schema, types} = callAPI;
    
    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState());
    }
    
    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }
    
    if (!schema) {
        throw new Error('Specify one of the exported schema.');
    }
    
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types');
    }
    
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be string');
    }
    
    function actionWith(data) {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_API];
        return finalAction;
    }
    
    const [requestType, successType, failureType] = types;
    next(actionWith({type: requestType, isFetching: true}));
    
    return callApi(endpoint, schema).then(
        res => next(actionWith({res, type: successType, isAuthenticated: true})), 
        error => next(actionWith({error, type: failureType}))
    );
}