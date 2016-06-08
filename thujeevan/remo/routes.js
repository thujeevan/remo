import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App';
import Login from './containers/LoginPage';
import Dashboard from './components/Dashboard';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Dashboard} />
        <Route path="/auth/login" component={Login} />
    </Route>
)