import fs from 'fs';
import path from 'path';
import express from 'express';

import morgan from 'morgan';
import compression from 'compression';

import dbInit from './db/';
import taskManager from './jobs/task-manager';

import config, { jobs } from './config';
import itemsRoutes from './routes/items';
import categoriesRoutes from './routes/categories';
import initServices from './services/';

import { captureError } from './utils/capture-error';

const app = express();

const publicPath = path.resolve(__dirname, '..', 'public');

const htmlPath = publicPath + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8');

dbInit(config.db, config.remote).then(db => {
  console.log('db init');

  app.use(morgan('request: :remote-addr :method :url :status'));

  const services = initServices(db);

  app.use('/', itemsRoutes(services, jobs));
  app.use('/', categoriesRoutes(services, jobs));

  if (process.env.NODE_ENV === 'production') {
    const renderReact = require('./server-render').default;

    app.get('/', reactRoute);
    app.use(compression());
    app.use(express.static(publicPath));
    app.get('*', reactRoute);

    function reactRoute(req, res, next) {
      renderReact(html, req.path)
        .then(html => res.end(html))
        .catch(err => next(err));
    }
  } else {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const wconfig = require('../webpack.config.dev');
    const compiler = webpack(wconfig);
    const middleware = webpackMiddleware(compiler, {
      ...wconfig.devServer,
      contentBase: __dirname
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));

    app.get('*', function response(req, res) {
      middleware.fileSystem
        .createReadStream(htmlPath)
        .pipe(res);
    });
  }

  app.use(function(err, req, res, next) {
    if (!err) {
      next();
    }

    captureError(err);
    res.status(err.status || 500).json({ error: err.stack });
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log('localhost:3000');

    if (config['disable-tasks']) {
      console.log('tasks disabled');
    } else {
      taskManager(db.db, jobs);
    }
  });
}).catch(err => {
  console.log(err.stack || err);
});
