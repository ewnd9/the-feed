export const FETCH_POSTS = 'FETCH_POSTS';

export const MARK_POST_AS_SEEN = 'MARK_POST_AS_SEEN';
export const MARK_POST_AS_CLICKED = 'MARK_POST_AS_CLICKED';

export function fetchPosts(job, id, date) {
  return {
    type: FETCH_POSTS,
    callAPI: ({ api }) => api.findByJob(job, id, date),
    payload: { job, id, date }
  };
}

export function markPostAsSeen(index, item) {
  return {
    type: MARK_POST_AS_SEEN,
    callAPI: ({ api }) => api.putSeen(item),
    payload: { index, item }
  };
}

export function markPostAsClicked(index, item) {
  return {
    type: MARK_POST_AS_CLICKED,
    callAPI: ({ api }) => api.putClicked(item),
    payload: { index, item }
  };
}
