'use strict';
const path = require('path');

module.exports = [{
    entry: './src/index.js',
    output: {
      path: path.resolve('./'),
      filename: 'engine.js',
      library: 'engine',
      libraryTarget: 'commonjs2'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' },
        { test: /\.json$/, exclude: /node_modules.*\.json/, loader: 'json-loader' },
      ]
    }
  }, {
    entry: './demo/index.js',
    output: {
      path: path.resolve('./public_html'),
      filename: 'demo.js'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' },
        { test: /\.css$/, exclude: /node_modules.*\.js/, loader: 'style-loader!css-loader' },
        { test: /\.json$/, exclude: /node_modules.*\.json/, loader: 'json-loader' },
      ]
    }
  }
];
