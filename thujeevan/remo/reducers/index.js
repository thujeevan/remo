import {Map, List, fromJS} from 'immutable';
import {combineReducers} from 'redux';

import auth from './auth';
import users from './users';

// shared entity namespace
// will hold all entity objects
export const ENTITIES_INITIAL_STATE = fromJS({users: {}, groups: {}});

function entities(state = ENTITIES_INITIAL_STATE, action) {
    if (action.res && action.res.entities) {
        // currently everything get merged
        return state.mergeDeep(action.res.entities);
    }
    return state;
}

const rootReducer = combineReducers({auth, users, entities});
export default rootReducer;