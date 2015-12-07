var Promise = require('bluebird');

export default (pouch, db, tasks) => {
	tasks.forEach((task) => {
		var currTask = require('./tasks/' + task.task + '-task');

		var job = {
			name: task.name,
			fn: () => currTask.task(task.params)
		};

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
	});
};
