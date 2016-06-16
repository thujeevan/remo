import {
    List,
    Map,
    fromJS
} from 'immutable';
import {
    expect
} from 'chai';

import reducer from '../reducers';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    USERS_REQUEST,
    USERS_SUCCESS,
    USERS_FAILURE
} from '../actions';

describe('reducer', () => {
    describe('auth', () => {
        it('handles LOGIN_REQUEST', () => {
            const action = {
                type: LOGIN_REQUEST,
                creds: {}
            };

            const next = reducer(undefined, action);
            expect(next.auth).to.equal(fromJS({
                isFetching: true,
                isAuthenticated: false,
                creds: {}
            }));
        });

        it('handles LOGIN_SUCCESS', () => {
            const initial = {
                isFetching: true,
                isAuthenticated: false
            };
            
            const action = {
                type: LOGIN_SUCCESS,
                session: {
                    token: 'sLpMaeKeoTn'
                }
            };
            const next = reducer({
                auth: fromJS(initial)
            }, action);
            
            expect(next.auth).to.equal(fromJS({
                isFetching: false,
                isAuthenticated: true,
                session: {
                    token: 'sLpMaeKeoTn'
                }
            }));
        });
        
        it('handles LOGIN_FAILURE', () => {
            const initial = {
                isFetching: true,
                isAuthenticated: false
            };
            const action = {
                type: LOGIN_FAILURE,
                message: "invalid credentials. please check and try again"
            };
            const next = reducer({
                auth: fromJS(initial)
            }, action);
            
            expect(next.auth).to.equal(fromJS({
                isFetching: false,
                isAuthenticated: false,
                message: "invalid credentials. please check and try again"
            }));
        });
        
        it('handles LOGOUT_REQUEST', () => {
            const initial = {
                isAuthenticated: true,
                isFetching: false,
                session: {
                    token: 'sLpMaeKeoTn'
                }
            };
            const action = {
                type: LOGOUT_REQUEST
            };
            const next = reducer({
                auth: fromJS(initial)
            }, action);
            const nextAuth = Object.assign({}, initial, {isFetching: true});
            expect(next.auth).to.equal(fromJS(nextAuth));
        });
        
        it('handles LOGOUT_REQUEST when there is no session', () => {
            // this is equal to AUTH_INITIAL_STATE
            const initial = {                
                isFetching: false,
                isAuthenticated: false,
                session: {}
            };
            const action = {
                type: LOGOUT_REQUEST
            };
            const next = reducer({
                auth: fromJS(initial)
            }, action);
            const nextAuth = Object.assign({}, initial, {isFetching: true});
            expect(next.auth).to.equal(fromJS(nextAuth));
        });
        
        it('handles LOGOUT_SUCCESS', () => {
            const initial = {
                isFetching: false,
                isAuthenticated: true
            };
            const action = {
                type: LOGOUT_SUCCESS
            };
            const next = reducer({
                auth: fromJS(initial)
            }, action);
            const nextAuth = Object.assign({}, initial, {isAuthenticated: false, session: {}});
            expect(next.auth).to.equal(fromJS(nextAuth));
        });
        
    });

    describe('user', () => {
        it ('handles USERS_REQUEST with default initial state', () => {
            const action = {
                type: USERS_REQUEST
            };
            const next = reducer({users: undefined}, action);
            expect(next.users).to.equal(fromJS({isFetching: true, users: [], meta: {}}));
        });
        
        it ('handles USERS_SUCCESS', () => {
            const state = {
                users: [{id: 1}, {id: 2}, {id: 3}],
                meta: {
                    total: 5
                }
            };
            
            const action = {
                type: USERS_SUCCESS,
                res: state
            };
            const next = reducer({users: undefined}, action);
            expect(next.users).to.equal(fromJS(Object.assign({}, state, {isFetching: false})));
        });
        
        it ('handles USERS_REQUEST with some intial state', () => {
            const fetched = {
                users: [{id: 1}, {id: 2}, {id: 3}],
                meta: {
                    total: 5
                }
            };
            const actions = [{
                type: USERS_SUCCESS,
                res: fetched
            }, {
                type: USERS_REQUEST
            }];
            const reduced = actions.reduce(reducer, {users: undefined});
            expect(reduced.users).to.equal(fromJS(Object.assign({}, fetched, {isFetching: true})));
        });
        
        it ('appends newly fetched users if existing users list is not empty', () => {
            const initial = {
                users: [{id: 1}, {id: 2}, {id: 3}],
                meta: {
                    total: 5
                }
            };
            
            const nextBatch = {
                users: [{id: 4}, {id: 5}],
                meta: {
                    total: 5
                }
            };
            
            const actions = [{
                type: USERS_SUCCESS,
                res: initial
            }, {
                type: USERS_REQUEST
            }, {
                type: USERS_SUCCESS,
                res: nextBatch
            }];
            
            const reduced = actions.reduce(reducer, {users: undefined});
            const final =  {
                users: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
                meta: {
                    total: 5
                }
            }
            expect(reduced.users).to.equal(fromJS(Object.assign(final, {isFetching: false})));
        });
    });
});