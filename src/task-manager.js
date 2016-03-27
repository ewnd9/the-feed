import Promise from 'bluebird';
import fs from 'fs';

const tasksModules = fs.readdirSync(__dirname + '/tasks')
  .filter(name => name.indexOf('.map') !== name.length - 4)
  .reduce((total, name) => {
    total[name] = require('./tasks/' + name);
    return total;
  }, {});

export const createTask = (task) => {
  let currTask = tasksModules[task.task + '-task.js'];

  if (currTask.default) {
    currTask = currTask.default; // es6 import workaround
  }

  return () => currTask.task(task.params);
};

export const runTask = (pouch, db, task) => {
  const log = console.log.bind(console, task.name);
  log(new Date());

  const stats = {
    existed: 0,
    added: 0
  };

  var execTask = createTask(task);

  return execTask()
    .then((items) => {
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
            return db.add(item).then(() => {
              stats.added++;
            }, (err) => {
              log(err);
            });
          } else {
            log(err);
          }
        });
      });
    })
    .then(() => {
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
    })
    .catch((err) => {
      log(err, err.stack);
    });
};

export default (pouch, db, tasks) => {
  tasks.forEach(task => {
    const fn = runTask.bind(null, pouch, db, task);
    setInterval(fn, 1000 * 60 * task.interval);
    fn();
  });
};
