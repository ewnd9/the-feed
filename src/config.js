import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';

import table from 'table';
import parseInterval from './utils/parse-interval';

const configFile = process.env.CONFIG || 'config.yml';
const config = yaml.safeLoad(fs.readFileSync(__dirname + '/../' + configFile, 'utf8'));

const _tasks = _.map(config.tasks, (task, name) => ({ ...task, name }));
const report = _tasks.map(task => {
  let label;

  if (!task.interval) {
    task.interval = 40;
    label = `40m (default)`;
  } else {
    let minutes;

    try {
      minutes = parseInterval(task.interval);
    } catch (e) {
      throw new Error(`${task.name} has incorrect interval: "${task.interval}"`);
    }

    if (minutes === 0) {
      throw new Error(`"${task.interval}" is not correct`);
    }

    if (parseInt(task.interval) !== minutes) {
      label = `${task.interval} (${minutes}m)`;
    } else {
      label = task.interval;
    }

    task.interval = minutes;
  }

  return [task.name, label];
});

console.log(table(report));

export const jobs = _tasks;
export default config;
