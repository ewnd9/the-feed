import fs from 'fs';
import path from 'path';
import express from 'express';

import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';

import dbInit from './db/';
import config from './config';

import itemsRoutes from './routes/items';
import jobsRoutes from './routes/jobs-routes';

import initServices from './services/';

import { captureError } from './utils/capture-error';

const publicPath = path.resolve(__dirname, '..', 'public');

const htmlPath = publicPath + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8');

export default start;

function start() {
  return dbInit(config.db, config.remote)
    .then(db => {
      const app = express();
      const services = initServices(db);

      app.use(morgan('request: :remote-addr :method :url :status'));

      app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
      app.use(bodyParser.json({ limit: '50mb' }));

      app.use('/', itemsRoutes(services));
      app.use('/', jobsRoutes(services));

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
      } else if (process.env.NODE_ENV === 'development') {
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
        res.status(err.status || 500).json({ error: err.stack || err });
      });

      const port = process.env.PORT || config.port;
      const server = app.listen(port, () => {
        console.log(server.address());

        if (config['disable-tasks']) {
          console.log('tasks disabled');
        } else {
          services.jobsService.init();
        }
      });

      return { server, app, db, services };
    });
}
