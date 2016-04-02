import Promise from 'bluebird';
import fs from 'fs';

const tasksModules = fs.readdirSync(__dirname + '/tasks')
  .filter(name => name.indexOf('.map') !== name.length - 4)
  .reduce((total, name) => {
    total[name] = require('./tasks/' + name);
    return total;
  }, {});

export const runTask = (pouch, db, task) => {
  const log = console.log.bind(console, task.name);
  log(new Date());

  const stats = {
    existed: 0,
    added: 0,
    overLimit: 0
  };

  let currTask = tasksModules[task.task + '-task.js'];

  if (currTask.default) {
    currTask = currTask.default; // es6 import workaround
  }

  let refineCount = 0;

  return currTask.task(task.params)
    .then((items) => {
      stats.total = items.length;
      return Promise.map(items, processItem);
    })
    .then(() => addUnseenCategoriesStatuses())
    .catch((err) => {
      log(err, err.stack);
    });

  function processItem(item) {
    item.meta = {
      task: task.name,
      seen: false
    };

    item.id = task.name + ':' + item.id.replace(/\W/g, '');

    return db.find(item.id)
      .then(item => {
        stats.existed++;
      }, (err) => {
        if (err.reason === 'missing') {
          return addIfNotFound(item);
        } else {
          log(err);
        }
      });
  };

  function addIfNotFound(item) {
    if (currTask.refine) {
      if (currTask.refineLimit) {
        if (refineCount < currTask.refineLimit) {
          refineCount++;

          return currTask.refine(task.params, item)
            .then(item => db.add(item))
            .then(() => {
              stats.added++;
            }, (err) => {
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
        }, (err) => {
          log(err);
        });
    }
  };

  function addUnseenCategoriesStatuses() {
    log(stats);

    if (stats.added > 0) {
      const unseenStat = {
        id: 'system-unseen:' + task.name,
        unseen: true,
        task: task.name
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
  };
};

export default (pouch, db, tasks) => {
  tasks.forEach((task, i) => {
    setTimeout(() => {
      const fn = runTask.bind(null, pouch, db, task);
      setInterval(fn, 1000 * 60 * task.interval);
      fn();
    }, i * 1000 * 10);
  });
};
