const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export const findByCategory = (categoryId, page) => {
	return fetch(baseUrl + `/api/v1/categories/items/${categoryId}?page=` + page)
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

export const putSeen = (item) => put(baseUrl + `/api/v1/items/${item._id}/seen`, { seen: true });
export const putClicked = (item) => put(baseUrl + `/api/v1/items/${item._id}/clicked`, { clicked: true });
