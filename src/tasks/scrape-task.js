import Xray from 'x-ray';
import Promise from 'bluebird';

const x = Xray();

const task = (url, selector, titleSelector, urlSelector) => {
	return new Promise((resolve, reject) => {
		x(url, {
		  items: x(selector, [{
		    title: titleSelector,
				url: urlSelector
			}])
		})((err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result.items);
			}
		});
	});
};

export default { task };
