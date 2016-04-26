import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers/index';

const middleware = [
  thunkMiddleware
];

if (typeof window !== 'undefined') {
  middleware.push(createLogger());
}

const createStoreWithMiddleware = applyMiddleware.apply(null, middleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
