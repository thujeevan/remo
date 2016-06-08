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
    LOGOUT_REQUEST
} from '../actions';

describe('reducer', () => {
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
});