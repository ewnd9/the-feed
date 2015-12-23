import Promise from 'bluebird';

export const createTask = (task) => {
	let currTask = require('./tasks/' + task.task + '-task');

	if (currTask.default) {
		currTask = currTask.default; // es6 import workaround
	}

	currTask.makeJob = () => currTask.task(task.params);
	return currTask;
};

export default (pouch, db, tasks) => {
	tasks.forEach((task) => {
		var currTask = createTask(task);
		var log = (msg) => console.log(task.name, msg);

		var fn = () => {
			log(new Date());

			var stats = {
				existed: 0,
				added: 0
			};

			currTask.makeJob().then((items) => {
				return Promise.map(items, (item) => {
					item.meta = {
						task: task.name,
						seen: false
					};
					
					item.id = task.name + ':' + item.id.replace(/\W/g, '');

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
