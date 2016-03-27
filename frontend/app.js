import './style.css';
import 'babel-polyfill';

import ReactDOM from 'react-dom';
import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';

import Main from './components/main/main';
import PostsList from './components/posts-list/posts-list';

import configureStore from './configure-store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={PostsList} />
        <Route path="/r/:categoryId" component={PostsList} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
