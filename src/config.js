import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';

const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));

export const tasks = _.map(config.tasks, (task, name) => ({ ...task, name }));
export default config;
