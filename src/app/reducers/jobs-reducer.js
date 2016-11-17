import t from 'tcomb';
import { createCheckedReducer } from './utils';
import { Job } from '../../schema/';

import {
  FETCH_JOBS,
  MARK_CATEGORY_AS_SEEN
} from '../actions/jobs-actions';

export const schema = t.struct({
  isFetching: t.Boolean,
  jobs: t.list(Job)
});

export default createCheckedReducer({
  isFetching: false,
  jobs: []
}, {
  [FETCH_JOBS](state, action) {
    if (action.status === 'request') {
      return {
        ...state,
        isFetching: true
      };
    } else if (action.status === 'success') {
      return {
        ...state,
        isFetching: false,
        jobs: action.response
      };
    } else {
      return state;
    }
  },
  [MARK_CATEGORY_AS_SEEN](state, action) {
    if (action.status === 'request') {
      const job = state.jobs[action.payload.index];

      return {
        ...state,
        categories: [
          ...state.jobs.slice(0, action.index),
          {
            ...job,
            unseen: false
          },
          ...state.jobs.slice(action.index + 1)
        ]
      };
    } else {
      return state;
    }
  }
}, schema);
