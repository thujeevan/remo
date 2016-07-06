import {
    List,
    Map,
    fromJS
} from 'immutable';
import {
    expect
} from 'chai';
import merge from 'lodash/merge';

import reducer from '../reducers';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    USERS_REQUEST,
    USERS_SUCCESS,
    USERS_FAILURE,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAILURE,
    REMOVE_ERROR,
    CLEAR_ERRORS
} from '../actions';

import errorReducer from '../reducers/error';

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
                error: {
                    res: {
                        reason: 'Invalid username or password'
                    },
                    status: 400
                }
            };
            const next = reducer({
                auth: fromJS(initial)
            }, action);
            
            expect(next.auth).to.equal(fromJS({
                isFetching: false,
                isAuthenticated: false
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
                users: [1, 2, 3],
                meta: {
                    total: 5
                }
            };
            
            const action = {
                type: USERS_SUCCESS,
                res: {
                    result: state
                }
            };
            const next = reducer({users: undefined}, action);
            expect(next.users).to.equal(fromJS(Object.assign({}, state, {isFetching: false})));
        });
        
        it ('handles USERS_REQUEST with some intial state', () => {
            const fetched = {
                users: [1, 2, 3],
                meta: {
                    total: 5
                }
            };
            const actions = [{
                type: USERS_SUCCESS,
                res: {result: fetched}
            }, {
                type: USERS_REQUEST
            }];
            const reduced = actions.reduce(reducer, {users: undefined});
            expect(reduced.users).to.equal(fromJS(Object.assign({}, fetched, {isFetching: true})));
        });
        
        it ('appends newly fetched users if existing users list is not empty', () => {
            const initial = {
                users: [1, 2, 3],
                meta: {
                    total: 5
                }
            };
            
            const nextBatch = {
                users: [4, 5],
                meta: {
                    total: 5
                }
            };
            
            const actions = [{
                type: USERS_SUCCESS,
                res: {result: initial}
            }, {
                type: USERS_REQUEST
            }, {
                type: USERS_SUCCESS,
                res: {result: nextBatch}
            }];
            
            const reduced = actions.reduce(reducer, {users: undefined});
            const final =  {
                users: [1, 2, 3, 4, 5],
                meta: {
                    total: 5
                }
            }
            expect(reduced.users).to.equal(fromJS(Object.assign(final, {isFetching: false})));
        });
    });
    
    describe('entities', () => {        
        it ('handles USERS_SUCCESS - add entities', () => {            
            const users = {
                1: { uid: 1},
                2: { uid: 2},
                3: { uid: 3}
            };
            
            const action = {
                type: USERS_SUCCESS,
                res: {
                    result: {
                        meta: {}
                    },
                    entities: {
                        users
                    }
                }
            };
            const next = reducer(undefined, action);
            expect(next.entities.users).to.equal(fromJS(Object.assign({}, users)));
        });
        it ('merge entities when next batch comes', () => {            
            const first = {
                1: { uid: 1},
                2: { uid: 2},
                3: { uid: 3}
            };
            
            const second = {
                4: { uid: 4},
                5: { uid: 5},
                6: { uid: 6}
            };
            
            const action = {
                type: USERS_SUCCESS,
                res: {
                    result: {
                        meta: {}
                    },
                    entities: {
                        users: {}
                    }
                }
            };
            const act1 = merge({}, action, {res: {entities: {users: first}}});
            const act2 = merge({}, action, {res: {entities: {users: second}}});
            
            const actions = [act1, act2];
            
            const final = actions.reduce(reducer, undefined);
            expect(final.entities.users).to.equal(fromJS(Object.assign({}, first, second)));
        });
        it ('eliminates duplicate entities while merging', () => {            
            const first = {
                1: { uid: 1},
                2: { uid: 2},
                3: { uid: 3}
            };
            
            const second = {
                3: { uid: 3},
                5: { uid: 5},
                6: { uid: 6}
            };
            
            const action = {
                type: USERS_SUCCESS,
                res: {
                    result: {
                        meta: {}
                    },
                    entities: {
                        users: {}
                    }
                }
            };
            const act1 = merge({}, action, {res: {entities: {users: first}}});
            const act2 = merge({}, action, {res: {entities: {users: second}}});
            
            const actions = [act1, act2];
            
            const final = actions.reduce(reducer, undefined);
            expect(final.entities.users).to.equal(fromJS(Object.assign({}, first, second)));
        });
        
        it ('handles USER_UPDATE_REQUEST', () => {            
            const users = {
                1: { uid: 1},
                2: { uid: 2},
                3: { uid: 3}
            };
            
            const action = {
                type: USER_UPDATE_REQUEST,
                user: {
                    uid: 1
                }
            };
            const initial = {
                entities: {
                    users: fromJS(users)
                }
            }
            const next = reducer(initial, action);
            expect(next.entities.users.getIn(['1', 'isUpdating'])).to.equal(true);
            expect(next.entities.users.getIn(['2', 'isUpdating'])).to.equal(undefined);
        });
        
        it ('replaces corresponding data with the response on USER_UPDATE_SUCCESS', () => {            
            const users = {
                1: { uid: 1, name: "sample name"},
                2: { uid: 2},
                3: { uid: 3}
            };
            
            const initialAction = {
                type: USER_UPDATE_REQUEST,
                user: {
                    uid: 1
                }
            };
            const updateAction = {
                type: USER_UPDATE_SUCCESS,
                res: {
                    user: {
                        uid: 1,
                        name: 'updated sample name'
                    }
                }
            };
            const initial = {
                entities: {
                    users: fromJS(users)
                }
            }
            
            let next = reducer(initial, initialAction);
            expect(next.entities.users.getIn(['1', 'isUpdating'])).to.equal(true);
            expect(next.entities.users.getIn(['1', 'name'])).to.equal('sample name');
            
            next = reducer(next, updateAction);
            expect(next.entities.users.getIn(['1', 'name'])).to.equal('updated sample name');
        });
    });
    
    describe('errors', () => {        
        it ('handles USERS_FAILURE - errors which follow common pattern', () => {
            const action = {
                type: USERS_FAILURE,
                error: {
                    res: {
                        reason: 'Failed to fetch users'
                    },
                    status: 500
                }
            };
            
            const next = errorReducer(undefined, action);
            expect(next.size).to.equal(1);
            expect(next.getIn([0, 'reason'])).to.equal('Failed to fetch users');
            expect(next.getIn([0, 'status'])).to.equal(500);
        });
        
        it ('prepends error record', () => {
            const ac1 = {
                type: USERS_FAILURE,
                error: {
                    res: {
                        reason: 'Failed to fetch users'
                    },
                    status: 500
                }
            };
            
            const ac2 = {
                type: USER_UPDATE_FAILURE,
                error: {
                    res: {
                        errors: []
                    },
                    status: 422
                }
            };
            
            const next = [ac1, ac2].reduce(errorReducer, undefined);
            
            expect(next.size).to.equal(2);
            expect(next.getIn([0, 'errors']).length).to.equal(0);
            expect(next.getIn([0, 'status'])).to.equal(422);
            expect(next.getIn([1, 'reason'])).to.equal('Failed to fetch users');
            expect(next.getIn([1, 'status'])).to.equal(500);
        });
        
        it ('removes provided error', () => {
            const ac1 = {
                type: USERS_FAILURE,
                error: {
                    res: {
                        reason: 'Failed to fetch users'
                    },
                    status: 500
                }
            };
            
            const ac2 = {
                type: USER_UPDATE_FAILURE,
                error: {
                    res: {
                        errors: []
                    },
                    status: 422
                }
            };
            
            let next = [ac1, ac2].reduce(errorReducer, undefined);
            const error = next.get(0);
            
            const ac3 = {
                type: REMOVE_ERROR,
                error
            }
            
            next = errorReducer(next, ac3);
            
            expect(next.size).to.equal(1);
            expect(next.getIn([0, 'reason'])).to.equal('Failed to fetch users');
            expect(next.getIn([0, 'status'])).to.equal(500);
        });
        
        it ('clears errors', () => {
            const ac1 = {
                type: USERS_FAILURE,
                error: {
                    res: {
                        reason: 'Failed to fetch users'
                    },
                    status: 500
                }
            };
            
            const ac2 = {
                type: USER_UPDATE_FAILURE,
                error: {
                    res: {
                        errors: []
                    },
                    status: 422
                }
            };
            
            let next = [ac1, ac2].reduce(errorReducer, undefined);
            const error = next.get(0);
            
            const ac3 = {
                type: CLEAR_ERRORS
            }
            
            next = errorReducer(next, ac3);            
            expect(next.size).to.equal(0);
        });
    });
});