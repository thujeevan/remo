import {combineReducers} from 'redux';

import auth from './auth';
import users from './users';
import entities from './entities';
import error from './error';

const rootReducer = combineReducers({
    auth, 
    users, 
    entities,
    error
});
export default rootReducer;