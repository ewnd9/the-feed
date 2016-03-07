import { combineReducers } from 'redux';

import posts from './posts-reducer';
import categories from './categories-reducer';

const rootReducer = combineReducers({
  posts,
  categories
});

export default rootReducer;
