import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers/index';
import createApiCallMiddleware from './middleware/api-call-middleware';

export default function configureStore(initialState, api) {
  const middleware = [
    thunkMiddleware.withExtraArgument({ api }),
    createApiCallMiddleware({ api })
  ];

  if (typeof window !== 'undefined') {
    middleware.push(createLogger({
      collapsed: true,
      titleFormatter(action, time, took) {
        const parts = [`action`];

        parts.push(`@ ${time}`);
        parts.push(action.type + (action.status ? `_${action.status.toUpperCase()}`: ''));
        parts.push(`(in ${took.toFixed(2)} ms)`);

        return parts.join(` `);
      }
    }));
  }

  const createStoreWithMiddleware = applyMiddleware.apply(null, middleware)(createStore);

  return createStoreWithMiddleware(rootReducer, initialState);
}
