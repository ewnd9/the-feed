import * as api from '../api';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const MARK_POST_AS_SEEN = 'MARK_POST_AS_SEEN';
export const MARK_POST_AS_CLICKED = 'MARK_POST_AS_CLICKED';

function requestPosts(category) {
  return {
    type: REQUEST_POSTS,
    category
  };
};

function receivePosts(category, json, clear) {
  return {
    type: RECEIVE_POSTS,
    items: json,
    clear
  };
};

export function fetchPosts(category, id, date) {
  return (dispatch, getState) => {
    dispatch(requestPosts(category));

    return api
      .findByCategory(category, id, date)
      .then(json => dispatch(receivePosts(category, json, !!!id)));
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
