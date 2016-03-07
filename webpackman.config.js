const isProd = process.env.NODE_ENV === 'production';
const config = require(
  isProd ?
    'webpackman/webpack.config.prod.js' :
    'webpackman/webpack.config.js'
);

const postcss = config.postcss;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

config.postcss = function(webpack) {
  return postcss.concat([
    require('postcss-import')({
      addDependencyTo: webpack
    }),
    require('postcss-cssnext')
  ]);
};

if (isProd) {
  const prodLoaders = config.module.loaders.reduce((total, curr) => {
    if (curr.loader.indexOf('extract') && curr.include && curr.include.toString() === '/components/') {
      total.push({
        test: /\.css$/,
        include: /components/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
        )
      });
    } else {
      total.push(curr);
    }

    return total;
  }, []);

  config.module.loaders = prodLoaders;
}

module.exports = config;
