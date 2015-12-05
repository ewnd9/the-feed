import express from 'express';
var app = express();

import morgan from 'morgan';
import cors from 'express-cors';

import Promise from 'bluebird';

import dbInit from './db-init';
import taskManager from './task-manager';

dbInit().then(({ pouch, db }) => {
  console.log('db init');

  app.use(morgan('request: :remote-addr :method :url :status'));
  app.use(express.static('public'));
  app.use(cors({
    allowedOrigins: [
      'localhost:3000',
      'localhost:8080',
      'localhost:8000',
    ]
  }));

  app.get('/api/v1/data', (req, res) => {
    const page = Math.max(parseInt(req.query.page), 1);

    const limit = 5;
    const skip = (page - 1) * limit;

    pouch.query('by_updated_at', { descending: true, limit, skip }).then((data) => {
      const result = data.rows.map((row) => row.value);
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });

  var server = app.listen(3000, () => {
    console.log('localhost:3000');
    taskManager(pouch, db);
  });
}).catch((err) => {
  console.log(err.stack);
});
