export default TaskManager;

function TaskManager(services) {
  this.services = services;
}

TaskManager.prototype.runJob = function(job) {
  const log = console.log.bind(console, job.name);
  log(new Date());

  const stats = {
    existed: 0,
    added: 0,
    overLimit: 0
  };

  const task = new Task(this.services, job, log, stats);
  return task
    .run()
    .then(() => this.addUnseenCategoriesStatuses(job, log, stats))
    .catch(err => log(err));
};

TaskManager.prototype.addUnseenCategoriesStatuses = function(job, log, stats) {
  log(stats);

  if (stats.added > 0) {
    return this.services.jobsService.updateUnseenStatus(job, true);
  }
};

function Task(services, job, log, stats) {
  this.services = services;
  this.job = job;
  this.log = log;
  this.stats = stats;
  this.refineCount = 0;

  this.executor = require(`./tasks/${job.task}/${job.task}.js`).default;
}

Task.prototype.run = function() {
  return this.executor
    .task(this.job.params)
    .then(items => {
      this.stats.total = items.length;
      return Promise.all(items.reverse().map(item => this.processItem(item)));
    })
    .catch(err => {
      this.log(err, err.stack);
    });
};

Task.prototype.processItem = function({ id, url, title, data }) {
  const { postsService } = this.services;

  const item = {
    meta: {
      jobId: this.job._id,
      jobName: this.job.name,
      task: this.job.task,
      seen: false
    },
    url,
    title,
    data
  };

  item._id = this.job._id + '-' + id.replace(/\W+/g, '-');

  return postsService.upsert(item, this.addIfNotFound.bind(this))
    .then(
      ([ isUpdated, res ]) => {
        if (isUpdated) {
          this.stats.existed++;
        } else {
          this.stats.added++;
        }

        return res;
      },
      err => {
        if (err.message === 'Over Limit') {
          this.stats.overLimit++;
          return null;
        }

        return Promise.reject(err);
      }
    );
};

Task.prototype.addIfNotFound = function(item) {
  if (this.executor.refine) {
    if (this.executor.refineLimit) {
      if (this.refineCount < this.executor.refineLimit) {
        this.refineCount++;

        return this.executor
          .refine(this.job.params, item);
      } else {
        return Promise.reject(new Error(`Over Limit`));
      }
    }
  } else {
    return Promise.resolve(item);
  }
};
