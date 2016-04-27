import fetch from 'isomorphic-fetch';

const baseUrl = (() => {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return `http://localhost:${process.env.PORT || 3000}`;
    } else {
      return 'http://localhost:3000';
    }
  } else {
    return '';
  }
})();

export const findByCategory = (categoryId, id, date) => {
  const params = (id && date) ? `id=${id}&date=${date}` : '';
  return fetch(baseUrl + `/api/v1/categories/items/${categoryId}?${params}`)
    .then(_ => _.json());
};

export const findCategories = () => {
  return fetch(baseUrl + '/api/v1/categories')
    .then(_ => _.json());
};

const put = (url, body) => {
  return fetch(url, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

export const putSeen = item => put(baseUrl + `/api/v1/items/${item._id}/seen`, { seen: true });
export const putClicked = item => put(baseUrl + `/api/v1/items/${item._id}/clicked`, { clicked: true });
export const putCategorySeen = category => put(baseUrl + `/api/v1/categories/${category.name}`, {});