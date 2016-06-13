import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App';
import Login from './containers/LoginPage';
import Dashboard from './components/Dashboard';

export default function (store) {    
    const connect = (fn) => (nextState, replace) => fn && fn(store, nextState, replace);
    const onEnter = (Component) => connect(Component.onEnter);
    
    return (
        <Route path="/" component={App}>
            <IndexRoute component={Dashboard} onEnter={onEnter(Dashboard)}/>
            <Route path="/auth/login" component={Login} onEnter={onEnter(Login)}/>
        </Route>
    );
}