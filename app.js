'use strict';

require('source-map-support').install();
require('./dist/backend')()
  .catch(err => {
    console.log(err.stack || err);
  });;
