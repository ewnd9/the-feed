'use strict';

require('./src/server').default()
  .catch(err => {
    console.log(err.stack || err);
  });;
