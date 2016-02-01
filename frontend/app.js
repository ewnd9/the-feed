require('./style.css');

import ReactDOM from 'react-dom';
import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

import Main from './components/main/main';
import PostsList from './components/posts-list/posts-list';

import configureStore from './configure-store';

const store = configureStore();
const history = createHistory();

syncReduxAndRouter(history, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Main}>
        <IndexRoute component={PostsList} />
        <Route path="/r/:categoryId" component={PostsList} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
