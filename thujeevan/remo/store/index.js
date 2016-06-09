import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import api from '../middleware/api';
import rootReducer from '../reducers';

export default function configureStore(preloadedState) {
    return createStore(rootReducer, preloadedState, compose(
        applyMiddleware(thunk, api),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
}