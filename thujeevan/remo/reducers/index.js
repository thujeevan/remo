import {combineReducers} from 'redux';

import auth from './auth';
import users from './users';
import entities from './entities';

const rootReducer = combineReducers({auth, users, entities});
export default rootReducer;