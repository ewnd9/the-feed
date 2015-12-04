var express = require('express');
var app = express();

var morgan = require('morgan');
var cors = require('express-cors');

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-hoodie-api'));

var userHome = require('user-home');
var db = new PouchDB(userHome + '/the-feed-db').hoodieApi({});

var Promise = require('bluebird');

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
  db.findAll().then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

var scrapeTask = require('./tasks/scrape-task');
var job = {
  name: 'scrape-reddit',
  fn: () => {
    var url = 'https://www.reddit.com/r/node/search?q=node.js&sort=new&restrict_sr=on';
    var selector = '.search-result';

    var titleSelector = '.search-title';
    var urlSelector = '.search-title@href';

    return scrapeTask.task(url, selector, titleSelector, urlSelector);
  }
};

var server = app.listen(3000, () => {
  console.log('localhost:3000');

  var fn = () => {
    var stats = {
      existed: 0,
      added: 0
    };

    job.fn().then((items) => {
      return Promise.map(items, (item) => {
        item.id = job.name + ':' + item.id;

        return db.find(item.id).then((item) => {
          stats.existed++;
        }, (err) => {
          if (err.reason === 'missing') {
            return db.add(item).then(() => stats.added++, (err) => {
              console.log(err);
            });
          } else {
            console.log(err);
          }
        });
      });
    }).then(() => {
      console.log(stats, new Date());
    }).catch((err) => {
      console.log(err);
    });
  };

  setTimeout(fn, 1000 * 60 * 10);
  fn();
});
