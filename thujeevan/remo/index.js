import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';

import configureStore from './store';
import Root from './containers/Root';

const store = configureStore();

render(<Root history={browserHistory} store={store}/>, document.getElementById('root'));