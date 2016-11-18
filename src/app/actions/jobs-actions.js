export const FETCH_JOBS = 'FETCH_JOBS';
export const UPSERT_JOB = 'UPSERT_JOB';
export const UPDATE_JOB_VALUE = 'UPDATE_JOB_VALUE';
export const MARK_JOB_AS_SEEN = 'MARK_JOB_AS_SEEN';

export function updateJobValue(job) {
  return {
    type: UPDATE_JOB_VALUE,
    job
  };
}

export function fetchJobs(force = false) {
  return {
    type: FETCH_JOBS,
    callAPI: ({ api }) => api.fetchJobs(),
    shouldCallAPI: state => force || (!state.jobs.isFetching && state.jobs.jobs.length === 0),
    payload: { force }
  };
}

export function upsertJob(job) {
  return {
    type: UPSERT_JOB,
    callAPI: ({ api }) => job._id ? api.updateJob(job) : api.createJob(job),
    payload: { job }
  };
}

export function markJobAsSeen(index) {
  return (dispatch, getState) => {
    const job = getState().jobs.jobs[index];

    return dispatch({
      type: MARK_JOB_AS_SEEN,
      callAPI: ({ api }) => api.putJobAsSeen(job)
    });
  };
}
