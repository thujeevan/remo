import {Map, List, fromJS} from 'immutable';
import {USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE} from '../actions';

export const USERS_INITIAL_STATE = fromJS({
    isFetching: false,
    users: [],
    meta: {}
});

const usersReducers = {
    [USERS_REQUEST]: (state) => {
        return state.merge({
            isFetching: true
        });
    },
    [USERS_SUCCESS]: (state, {res: {result: {meta, users}}}) => {
        const updated = state.get('users').concat(fromJS(users));
        return state.set('isFetching', false)
                .set('meta', fromJS(meta))
                .set('users', updated);
    },
    [USERS_FAILURE]: (state, {error}) => {
        return state.merge({
            isFetching: false,
            error
        });
    }
};

export default function users(state = USERS_INITIAL_STATE, action) {
    let reducer = usersReducers[action.type] || (state => state);
    return reducer(state, action);
}