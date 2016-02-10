import chalk from 'chalk';
import _ from 'lodash';
import inquirer from 'inquirer-question';

import config, { tasks } from './config';
import { createTask } from './task-manager';

const choices = tasks.reduce((total, task) => {
  total[_.startCase(task.name)] = () => {
    createTask(task)().then((items) => {
      console.log();

      items.forEach((item) => {
        _.each(item, (val, key) => {
          console.log(`  ${chalk.underline(key)}: ${val}`)
        });
        console.log();
      });

      console.log(`  ${chalk.red('Total count')}: ${items.length}\n`);
    });
  };

  return total;
}, {});

inquirer.prompt({
  type: 'list',
  message: 'Select Task',
  choices
});
