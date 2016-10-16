import {combineReducers} from 'redux';

import auth from './auth';
import users from './users';
import entities from './entities';
import alerts from './alerts';

const rootReducer = combineReducers({
    auth, 
    users, 
    entities,
    alerts
});
export default rootReducer;