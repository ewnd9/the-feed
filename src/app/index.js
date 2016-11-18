import './style.css';
import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router/lib/Router';
import match from 'react-router/lib/match';

import { trigger } from 'redial';
import browserHistory from 'react-router/lib/browserHistory';

import { Provider } from 'react-redux';

import routes from './routes';
import createApi from './api';
import configureStore from './configure-store';

const initialState = window.INITIAL_STATE || {};

const baseUrl = (() => {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return `http://localhost:${process.env.PORT || 3000}`;
    } else {
      return 'http://localhost:3000';
    }
  } else {
    return '';
  }
})();

const api = createApi(baseUrl);
const store = configureStore(initialState, api);

const { dispatch } = store;
const { pathname, search, hash } = window.location;

const location = `${pathname}${search}${hash}`;

match({ routes, location }, () => {
  render((
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>
  ), document.getElementById('root'));
});

browserHistory.listen(location => {
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    const { components } = renderProps;

    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch,
      getState: store.getState
    };

    if (window.INITIAL_STATE) {
      delete window.INITIAL_STATE;
    } else {
      trigger('fetch', components, locals);
    }

    trigger('defer', components, locals);
  });
});
