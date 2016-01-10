require('./style.css');

import ReactDOM from 'react-dom';
import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

import Main from './components/main';
import ItemList from './components/item-list';

import configureStore from './configure-store';

const store = configureStore();
const history = createHistory();

syncReduxAndRouter(history, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Main}>
        <IndexRoute component={ItemList} />
        <Route path="/r/:categoryId" component={ItemList} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
