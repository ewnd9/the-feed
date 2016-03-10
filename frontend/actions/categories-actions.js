import * as api from '../api';

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECIEVE_CATEGORIES = 'RECIEVE_CATEGORIES';
export const MARK_CATEGORY_AS_SEEN = 'MARK_CATEGORIES_AS_SEEN';

function requestCategories() {
  return {
    type: REQUEST_CATEGORIES
  };
};

function recieveCategories(categories) {
  return {
    type: RECIEVE_CATEGORIES,
    categories
  };
};

export function fetchCategories() {
  return (dispatch, getState) => {
    dispatch(requestCategories());

    return api
      .findCategories()
      .then(categories => dispatch(recieveCategories(categories)));
  };
};

export function markCategoryAsSeen(index) {
  return (dispatch, getState) => {
    const category = getState().categories.categories[index];

    return api.putCategorySeen(category)
      .then(() => dispatch({ type: MARK_CATEGORY_AS_SEEN, index }));
  };
};
