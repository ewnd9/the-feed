import chalk from 'chalk';
import { startCase } from 'lodash';
import inquirer from 'inquirer-question';

import config, { tasks as jobs } from './config';

function printObject(obj) {
  Object.keys(obj).forEach(key => {
    console.log(`  ${chalk.underline(key)}: ${obj[key]}`);
  });
  console.log(); // newline
};

export default flags => {
  const choices = jobs.reduce((total, job) => {
    const task = require(`./tasks/${job.task}-task.js`).default;

    total[startCase(job.name)] = () => {
      task
        .task(job.params)
        .then(items => {
          items.forEach(printObject);
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
    };

    return total;
  }, {});

  inquirer.prompt({
    type: 'list',
    message: 'Select Task',
    choices
  });
};
