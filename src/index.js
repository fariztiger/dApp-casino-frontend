import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';

import './index.scss';
import Machine from './pages/Machine/Machine';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <Provider store={store}>
        <Machine/>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
