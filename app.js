'use strict';

require('source-map-support').install();
require('./dist/backend').default()
  .catch(err => {
    console.log(err.stack || err);
  });;
