import path from 'path';
import express from 'express';
var app = express();

import morgan from 'morgan';
import cors from 'express-cors';

import Promise from 'bluebird';

import dbInit from './db';
import taskManager from './task-manager';

import config, { jobs } from './config';
import itemsRoutes from './routes/items';
import categoriesRoutes from './routes/categories';

import { captureError } from './utils/capture-error';

dbInit(config.db, config.remote).then(db => {
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

  app.use('/', itemsRoutes(db, jobs));
  app.use('/', categoriesRoutes(db, jobs));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
  });

  app.use(function(err, req, res, next) {
    if (!err) {
      next();
    }

    captureError(err);
    res.status(err.status || 500).json({ error: err.stack });
  });

  var server = app.listen(process.env.PORT || 3000, () => {
    console.log('localhost:3000');

    if (config['disable-tasks']) {
      console.log('tasks disabled');
    } else {
      taskManager(db.db, jobs);
    }
  });
}).catch((err) => {
  console.log(err.stack);
});
