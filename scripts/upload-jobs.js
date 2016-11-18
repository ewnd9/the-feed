'use strict';

const got = require('got');
const yaml = require('js-yaml');
const fs = require('fs');

if (process.argv.length < 4) {
  console.error(`Usage: $ node scripts/upload-jobs "http://localhost:3000" "config.yml"`);
  process.exit(0);
}

const [url, configFile] = process.argv.slice(2);

const config = yaml.safeLoad(fs.readFileSync(__dirname + '/../' + configFile, 'utf8'));

let queue = Promise.resolve();

Object.keys(config.tasks)
  .reduce((total, curr) => {
    const obj = config.tasks[curr];
    const ret = Object.assign({}, config.tasks[curr], { name: curr, task: obj.task + '-task' });

    total.push(ret);
    console.log(JSON.stringify(ret, null, 2));

    return total;
  }, [])
  .map(task => {
    const opts = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ job: task }),
      json: true
    };

    queue = queue.then(
      () => got(`${url}/api/v1/jobs`, opts),
      err => console.error(err)
    );
  });

queue
  .catch(err => console.log(err.stack || err));
