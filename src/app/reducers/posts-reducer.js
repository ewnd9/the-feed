import t from 'tcomb';
import { createCheckedReducer } from './utils';
import { Post } from '../../schema/';

import {
  FETCH_POSTS,
  MARK_POST_AS_SEEN,
  MARK_POST_AS_CLICKED
} from './../actions/posts-actions';

export const schema = t.struct({
  isFetching: t.Boolean,
  hasMore: t.Boolean,
  page: t.Number,
  posts: t.list(Post)
});

export default createCheckedReducer({
  isFetching: false,
  hasMore: false, // needed for InfiniteScroll, but first request is from Recall
  page: 0,
  posts: []
}, {
  [FETCH_POSTS](state, action) {
    if (action.status === 'request') {
      return {
        ...state,
        isFetching: true,
        page: action.payload.page || 1
      };
    } else if (action.status === 'success') {
      return {
        ...state,
        isFetching: false,
        posts: !!!action.payload.id ? action.response : [...state.posts, ...action.response],
        hasMore: action.response.length === 40
      };
    } else {
      return state;
    }
  },
  [MARK_POST_AS_SEEN](state, action) {
    if (action.status === 'request') {
      return {
        ...state,
        posts: updatedPostsAt(state, action.payload.index, { seen: true })
      };
    } else {
      return state;
    }
  },
  [MARK_POST_AS_CLICKED](state, action) {
    if (action.status === 'request') {
      return {
        ...state,
        posts: updatedPostsAt(state, action.payload.index, { clicked: true })
      };
    } else {
      return state;
    }
  },
}, schema);

function updatedPostsAt(state, index, obj) {
  const { posts } = state;
  const post = posts[index];

  return [
    ...posts.slice(0, index),
    {
      ...post,
      meta: {
        ...post.meta,
        ...obj
      }
    },
    ...posts.slice(index + 1)
  ];
}
