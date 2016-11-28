var path = require('path');

module.exports = function() {
  return {
    entry: './src/index.js',
    output: {
      filename: 'av.js',
      libraryTarget: "umd2",
      library: "AV",
      path: './dist'
    },
    resolve: {},
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../node_modules/weapp-polyfill'),
          ],
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
  }
};
