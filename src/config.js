import yaml from 'js-yaml';
import fs from 'fs';

const configFile = process.env.CONFIG || 'config.yml';
const config = yaml.safeLoad(fs.readFileSync(__dirname + '/../' + configFile, 'utf8'));

export default config;
