import t from 'tcomb';
import { createCheckedReducer } from './utils';
import { Job } from '../../schema/';

import {
  FETCH_JOBS,
  UPSERT_JOB,
  UPDATE_JOB_VALUE,
  MARK_CATEGORY_AS_SEEN
} from '../actions/jobs-actions';

export const schema = t.struct({
  isFetching: t.Boolean,
  jobs: t.list(Job),
  job: t.maybe(t.Object) // can't validate empty job without making every property maybe
});

export default createCheckedReducer({
  isFetching: false,
  jobs: [],
  job: null
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
  [UPSERT_JOB](state) {
    return state;
  },
  [UPDATE_JOB_VALUE](state, action) {
    return {
      ...state,
      job: action.job
    };
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
