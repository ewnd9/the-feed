const baseUrl = NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export const findByCategory = (categoryId, page) => {
	return fetch(baseUrl + `/api/v1/categories/items/${categoryId}?page=` + page)
		.then(_ => _.json());
};

export const findCategories = () => {
	return fetch(baseUrl + '/api/v1/categories')
		.then(_ => _.json());
};

export const putSeen = (item) => {
	return fetch(baseUrl + '/api/v1/items/' + item._id, {
		method: 'put',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			seen: true
		})
	});
}
