import express from 'express';
var app = express();

import morgan from 'morgan';
import cors from 'express-cors';

import Promise from 'bluebird';

import dbInit from './db-init';
import taskManager from './task-manager';

import config, { tasks } from './config';

dbInit(config.db).then(({ pouch, db }) => {
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

  app.get('/api/v1/items', (req, res) => {
    const page = Math.max(parseInt(req.query.page), 1);

    const limit = 20;
    const skip = (page - 1) * limit;

    pouch
      .query('by_created_at', {
        include_docs: true,
        descending: true,
        limit,
        skip
      }).then((data) => {
        const result = data.rows.map((row) => row.doc);
        res.json(result);
      }).catch((err) => {
        res.json(err);
      });
  });

  // \\S\\s is an alternative for .+
  app.put('/api/v1/items/:id([\\S\\s:]+)', (req, res) => {
    db.find(req.params.id).then((item) => {
      item.seen = true;
      return db.update(item);
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });

  app.get('/api/v1/categories', (req, res) => {
    res.json(tasks.map(_ => _.name));
  });

  app.get('/api/v1/categories/:id', (req, res) => {
    const category = req.params.id;
    const page = Math.max(parseInt(req.query.page), 1);

    const limit = 20;
    const skip = (page - 1) * limit;

    pouch
      .query('by_category', {
        include_docs: true,
        descending: true,
		    startkey: category + '$\uffff',
        limit,
        skip
      })
      .then((items) => {
        res.json(items.rows.map(_ => _.doc));
      })
      .catch((err) => {
        res.json(err);
      });
  });

  var server = app.listen(3000, () => {
    console.log('localhost:3000');
    taskManager(pouch, db, tasks);
  });
}).catch((err) => {
  console.log(err.stack);
});
