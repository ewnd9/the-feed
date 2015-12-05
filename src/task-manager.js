var Promise = require('bluebird');

var scrapeTask = require('./tasks/scrape-task');
var job = {
	name: 'scrape-reddit',
	fn: () => {
		var url = 'https://www.reddit.com/r/node/search?q=node.js&sort=new&restrict_sr=on';
		var selector = '.search-result';

		var titleSelector = '.search-title';
		var urlSelector = '.search-title@href';

		return scrapeTask.task(url, selector, titleSelector, urlSelector);
	}
};

export default (pouch, db) => {
	var fn = () => {
		console.log(new Date());

		var stats = {
			existed: 0,
			added: 0
		};

		job.fn().then((items) => {
			return Promise.map(items, (item) => {
				item.id = job.name + ':' + item.id;

				return db.find(item.id).then((item) => {
					stats.existed++;
				}, (err) => {
					if (err.reason === 'missing') {
						return db.add(item).then(() => stats.added++, (err) => {
							console.log(err);
						});
					} else {
						console.log(err);
					}
				});
			});
		}).then(() => {
			console.log(stats);
		}).catch((err) => {
			console.log(err.stack);
		});
	};

	setInterval(fn, 1000 * 60 * 5);
	fn();
};
