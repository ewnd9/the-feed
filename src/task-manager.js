var Promise = require('bluebird');

export default (pouch, db, tasks) => {
	tasks.forEach((task) => {
		var currTask = require('./tasks/' + task.task + '-task');
		if (currTask.default) {
			currTask = currTask.default; // es6 import workaround
		}

		var job = {
			name: task.name,
			fn: () => currTask.task(task.params)
		};

		var log = (msg) => console.log(task.name, msg);

		var fn = () => {
			log(new Date());

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
								log(err);
							});
						} else {
							log(err);
						}
					});
				});
			}).then(() => {
				log(stats);
			}).catch((err) => {
				log(err.stack);
			});
		};

		setInterval(fn, 1000 * 60 * 5);
		fn();
	});
};
