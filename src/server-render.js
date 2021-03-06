import React from 'react';

import { renderToString } from 'react-dom/server';
import { RouterContext, createMemoryHistory, match } from 'react-router';
import { Provider } from 'react-redux';

import { trigger } from 'redial';

import routes from './app/routes';
import configureStore from './app/configure-store';

export default (html, path) => new Promise((resolve, reject) => {
  const store = configureStore();
  const { dispatch, getState } = store;

  const history = createMemoryHistory(path);

  match({ routes, history }, (err, redirectLocation, renderProps) => {
    if (err) {
      throw err;
    }

    if (!renderProps) {
      const state = getState();
      const html = renderToString(
        <div>Not found</div>
      );

      resolve({ html, state });
    }

    const { components } = renderProps;

    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch
    };

    trigger('fetch', components, locals)
      .then(() => {
        const state = getState();
        const html = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );

        resolve({ html, state });
      })
      .catch(reject);
  });
})
.then(data => {
  return html
    .replace('<div id="root"></div>', `<div id="root">${data.html}</div>`)
    .replace('<script id="initial-state"></script>', `<script id="initial-state">window.INITIAL_STATE = ${JSON.stringify(data.state)};</script>`);
});
