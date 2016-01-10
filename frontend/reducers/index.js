import { combineReducers } from 'redux';
import { routeReducer as routing } from 'redux-simple-router';

import {
  REQUEST_POSTS,
  RECEIVE_POSTS,
  MARK_POST_AS_SEEN,
  MARK_POST_AS_CLICKED
} from './../actions';

function posts(state = {
  isFetching: false,
  hasMore: true,
  items: [],
  page: 0
}, action) {
  function updatedItemsAt(items, index, obj) {
    const item = state.items[index];

    return [
      ...items.slice(0, index),
      {
        ...item,
        meta: {
          ...item.meta,
          ...obj
        }
      },
      ...items.slice(index + 1)
    ]
  };

  switch (action.type) {
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        page: action.page
      };
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        items: action.clear ? action.items : [...state.items, ...action.items],
        hasMore: action.items.length === 40
      };
    case MARK_POST_AS_SEEN:
      return {
        ...state,
        items: updatedItemsAt(state.items, action.index, { seen: true })
      };
    case MARK_POST_AS_CLICKED:
      return {
        ...state,
        items: updatedItemsAt(state.items, action.index, { clicked: true })
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  routing,
  posts
});

export default rootReducer;
