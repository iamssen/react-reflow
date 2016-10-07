const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Copy Assets
const assetTypes = ['ico', 'svg', 'jpg', 'json', 'html', 'eot', 'ttf', 'woff'];
const assets = [];

assetTypes.reduce((files, extension) => {
  return glob.sync(`src/**/*.${extension}`).reduce((files, file) => {
    if (/.component.html/.test(file)) return files;
    files.push({
      from: file,
      to: file.replace('src/', '')
    });
    return files;
  }, files)
}, assets);

// Webpack Config
const webpackConfig = {
  entry: {
    'polyfills': './src/polyfills.js',
    'vendor': './src/vendor.js',
    'main': './src/main.jsx',
  },
  
  output: {
    path: './dist'
  },
  
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   chunks: [
    //     'component-showcase',
    //     'intergreate-control-search',
    //     'intergreate-control-search-component-showcase',
    //   ],
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'polyfills'],
      minChunks: Infinity,
    }),
    new CopyWebpackPlugin(assets)
  ],
  
  resolve: {
    root: [path.join(__dirname, 'src')],
    extensions: ['', '.js', '.jsx', '.json']
  },
  
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss']
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'postcss', 'less']
      },
      {
        test: /\.html$/,
        loader: 'raw'
      },
      {
        test: /\.txt$/,
        loader: 'raw'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    
    ]
  },
  
  postcss: () => [autoprefixer, precss]
}

const defaultConfig = {
  devtool: 'cheap-module-source-map',
  cache: true,
  debug: true,
  
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },
  
  devServer: {
    historyApiFallback: true,
    watchOptions: {aggregateTimeout: 300, poll: 1000}
  },
  
  node: {
    global: 1,
    crypto: 'empty',
    module: 0,
    Buffer: 0,
    clearImmediate: 0,
    setImmediate: 0
  }
}

module.exports = webpackMerge(defaultConfig, webpackConfig);
