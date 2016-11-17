export const FETCH_JOBS = 'FETCH_JOBS';
export const MARK_JOB_AS_SEEN = 'MARK_JOB_AS_SEEN';

export function fetchJobs() {
  return {
    type: FETCH_JOBS,
    callAPI: ({ api }) => api.fetchJobs()
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
