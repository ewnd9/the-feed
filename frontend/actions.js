import * as api from './api';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const MARK_POST_AS_SEEN = 'MARK_POST_AS_SEEN';
export const MARK_POST_AS_CLICKED = 'MARK_POST_AS_CLICKED';

function requestPosts(category, page) {
  return {
    type: REQUEST_POSTS,
    category,
    page
  };
};

function receivePosts(category, json) {
  return {
    type: RECEIVE_POSTS,
    items: json
  };
};

export function fetchPosts(category, page) {
  return (dispatch, getState) => {
    dispatch(requestPosts(category, page));

    return api
      .findByCategory(category, page)
      .then(json => dispatch(receivePosts(category, json)));
  };
};

export function markPostAsSeen(index, item) {
  api.putSeen(item);

  return {
    type: MARK_POST_AS_SEEN,
    index
  };
};

export function markPostAsClicked(index, item) {
  api.putClicked(item);

  return {
    type: MARK_POST_AS_CLICKED,
    index
  };
};
