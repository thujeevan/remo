import {normalize} from 'normalizr';
import 'isomorphic-fetch';

import {SESSION_KEY, loadData} from '../storage/localStorage';

export const METHOD_GET = 'GET';
export const METHOD_POST = 'POST';
export const METHOD_PUT = 'PUT';

export const API_ROOT = "http://localhost:3000";

const configureFetch = (endpoint, body, method = METHOD_GET) => (schema, options) => {
    const fullURL = (endpoint.indexOf(API_ROOT) === -1) ? `${API_ROOT}${endpoint}` : endpoint;
    const {token} = loadData(SESSION_KEY);
    
    body = typeof body === 'string' ? body : JSON.stringify(body);
    
    const config = {
        method,
        headers: { 
            "Content-Type": "application/json",
            Authorization: token 
        }
    };
    
    // Request with GET/HEAD method cannot have body
    if (method !== METHOD_GET) {
        config.body = body;
    }
    
    return fetch(fullURL, config).then(res => res.json().then(json => ({json, res}))).then(({json, res}) => {
        if (!res.ok) {
            return Promise.reject(json);
        }
        const normalized = Object.assign({}, normalize(json, schema, options));
        return normalized;
    });
}

function callApi(fetchAPI, schema, options = {}) {
    return fetchAPI(schema, options);
}

export const CALL_API = Symbol('Call API');

export default store => next => action => {
    const callAPI = action[CALL_API];
    if (!callAPI) {
        return next(action);
    }
    
    let {endpoint} = callAPI;
    const {method, schema, options, types} = callAPI;
    
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
    
    const fetchAPI = configureFetch(endpoint, actionWith({}), method);    
    const [requestType, successType, failureType] = types;
    
    next(actionWith({type: requestType}));    
    return callApi(fetchAPI, schema, options).then(
        res => next(actionWith({res, type: successType})), 
        error => next(actionWith({error, type: failureType}))
    );
}