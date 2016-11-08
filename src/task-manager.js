import Promise from 'bluebird';

export function TaskManager(db) {
  this.db = new DB(db);
}

TaskManager.prototype.runJob = function(job) {
  const log = console.log.bind(console, job.name);
  log(new Date());

  const stats = {
    existed: 0,
    added: 0,
    overLimit: 0
  };

  const task = new Task(this.db, job, log, stats);

  return task
    .run()
    .then(() => this.addUnseenCategoriesStatuses(job, log, stats))
    .catch(err => log(err));
};

TaskManager.prototype.addUnseenCategoriesStatuses = function(job, log, stats) {
  log(stats);

  if (stats.added > 0) {
    const unseenStat = {
      _id: 'system-unseen:' + job.name,
      unseen: true,
      task: job.name
    };

    return this.db.upsert(unseenStat, item => {
      item.unseen = true;
      return item;
    });
  }
}

function Task(db, job, log, stats) {
  this.db = db;
  this.job = job;
  this.log = log;
  this.stats = stats;
  this.executor = require(`./tasks/${job.task}-task/${job.task}-task.js`).default;
}

Task.prototype.run = function() {
  let refineCount = 0;

  return this.executor
    .task(this.job.params)
    .then(items => {
      this.stats.total = items.length;
      return Promise.map(items, item => this.processItem(item));
    })
    .catch(err => {
      this.log(err, err.stack);
    });
}

Task.prototype.processItem = function(item) {
  item.meta = {
    task: this.job.name,
    seen: false
  };

  item._id = this.job.name + ':' + item.id.replace(/\W/g, '') + '';

  item.original_id = item.id;
  delete item.id;

  return this.db.upsert(
    item,
    data => {
      this.stats.existed++;
      return data;
    },
    this.addIfNotFound.bind(this)
  );
}

Task.prototype.addIfNotFound = function(item) {
  if (this.executor.refine) {
    if (this.executor.refineLimit) {
      if (refineCount < this.executor.refineLimit) {
        refineCount++;

        return this.executor
          .refine(this.job.params, item)
          .then(item => this.db.add(item))
          .then(() => {
            this.stats.added++;
          }, err => {
            log(err);
          });
      } else {
        this.stats.overLimit++;
      }
    }
  } else {
    return this.db
      .add(item)
      .then(res => {
        this.stats.added++;
        return res;
      }, err => {
        log(err);
      });
  }
}

function DB(db) {
  this.db = db;
}

DB.prototype.add = function(item) {
  return this.db.add(item);
};

DB.prototype.upsert = function(item, upd = x => x, onNotFound) {
  return this.db
    .find(item._id)
    .then(data => {
      return this.db.add(upd(data));
    })
    .catch(err => {
      if (err.name === 'Not found') {
        if (onNotFound) {
          return onNotFound(item);
        } else {
          return this.db.add(item);
        }
      }

      return Promise.reject(err);
    });
}

export default (db, jobs) => {
  const manager = new TaskManager(db);

  jobs.forEach((job, i) => {
    setTimeout(() => {
      const fn = manager.runJob.bind(manager, job);
      setInterval(fn, 1000 * 60 * job.interval);
      fn();
    }, i * 1000 * 10);
  });
};
