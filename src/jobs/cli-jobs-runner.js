import chalk from 'chalk';
import { startCase } from 'lodash';
import inquirer from 'inquirer-question';

import { jobs } from '../config';

function printObject(obj, parent) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      printObject(obj[key], key);
    } else {
      console.log(`  ${chalk.underline((parent ? parent + '.' : '') + key)}: ${obj[key]}`);
    }
  });
  console.log(); // newline
}

function runJob(job, flags) {
  const task = require(`./tasks/${job.task}-task/${job.task}-task.js`).default;

  return task
    .task(job.params)
    .then(items => {
      items.forEach(item => printObject(item));
      console.log(`  ${chalk.red('Total count')}: ${items.length}\n`);

      if (flags.refine) {
        if (task.refine) {
          console.log('  refine: \n');

          task
            .refine(job.params, items[0])
            .then(printObject);
        } else {
          console.log(`  ${job.task} doesn't have "refine" function`);
        }
      }
    });
}


export default (flags, input) => {
  const choices = jobs.reduce((total, job) => {
    total[startCase(job.name)] = runJob.bind(null, job, flags);
    return total;
  }, {});

  if (input.length === 0) {
    inquirer.prompt({
      type: 'list',
      message: 'Select Task',
      choices
    });
  } else {
    const job = jobs.find(job => job.name === input[0]);

    if (!job) {
      console.error(`"${input[0]}" not found`);
    } else {
      runJob(job, flags);
    }
  }
};
