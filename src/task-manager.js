import Promise from 'bluebird';

export const runJob = (db, job) => {
  const log = console.log.bind(console, job.name);
  log(new Date());

  const stats = {
    existed: 0,
    added: 0,
    overLimit: 0
  };

  const currTask = require(`./tasks/${job.task}-task/${job.task}-task.js`).default;
  let refineCount = 0;

  return currTask.task(job.params)
    .then(items => {
      stats.total = items.length;
      return Promise.map(items, processItem);
    })
    .then(() => addUnseenCategoriesStatuses())
    .catch(err => {
      log(err, err.stack);
    });

  function processItem(item) {
    item.meta = {
      task: job.name,
      seen: false
    };

    item.id = job.name + ':' + item.id.replace(/\W/g, '');

    return db.find(item.id)
      .then(() => {
        stats.existed++;
      }, err => {
        if (err.reason === 'missing') {
          return addIfNotFound(item);
        } else {
          log(err);
        }
      });
  }

  function addIfNotFound(item) {
    if (currTask.refine) {
      if (currTask.refineLimit) {
        if (refineCount < currTask.refineLimit) {
          refineCount++;

          return currTask.refine(job.params, item)
            .then(item => db.add(item))
            .then(() => {
              stats.added++;
            }, err => {
              log(err);
            });
        } else {
          stats.overLimit++;
        }
      }
    } else {
      return db.add(item)
        .then(() => {
          stats.added++;
        }, err => {
          log(err);
        });
    }
  }

  function addUnseenCategoriesStatuses() {
    log(stats);

    if (stats.added > 0) {
      const unseenStat = {
        id: 'system-unseen:' + job.name,
        unseen: true,
        task: job.name
      };

      return db.find(unseenStat.id)
        .then(item => {
          item.unseen = true;
          return db.add(item);
        })
        .catch(err => {
          if (err.reason === 'missing') {
            return db.add(unseenStat);
          } else {
            log(err);
          }
        });
    }
  }
};

export default (db, jobs) => {
  jobs.forEach((job, i) => {
    setTimeout(() => {
      const fn = runJob.bind(null, db, job);
      setInterval(fn, 1000 * 60 * job.interval);
      fn();
    }, i * 1000 * 10);
  });
};
