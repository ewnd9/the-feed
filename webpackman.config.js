const config = require(
  process.env.NODE_ENV === 'production' ?
    'webpackman/webpack.config.prod.js' :
    'webpackman/webpack.config.js'
);

const postcss = config.postcss;

config.postcss = function(webpack) {
  return postcss.concat([
    require('postcss-import')({
      addDependencyTo: webpack
    }),
    require('postcss-cssnext')
  ]);
};

module.exports = config;
