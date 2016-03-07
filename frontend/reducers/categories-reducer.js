import {
  REQUEST_CATEGORIES,
  RECIEVE_CATEGORIES,
  MARK_CATEGORY_AS_SEEN
} from '../actions/categories-actions';

function categories(state = {
  isFetching: false,
  categories: []
}, action) {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetching: true
      };
    case RECIEVE_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        categories: action.categories
      };
    case MARK_CATEGORY_AS_SEEN:
      const category = state.categories[action.index];

      return {
        ...state,
        categories: [
          ...state.categories.slice(0, action.index),
          {
            ...category,
            unseen: false
          },
          ...state.categories.slice(action.index + 1)
        ]
      };
    default:
      return state;
  }
};

export default categories;
