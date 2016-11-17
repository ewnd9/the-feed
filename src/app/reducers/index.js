import { combineReducers } from 'redux';

import posts from './posts-reducer';
import jobs from './jobs-reducer';

const rootReducer = combineReducers({
  posts,
  jobs
});

export default rootReducer;
