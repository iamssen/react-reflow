const webpack = require('webpack');

const env = process.env.NODE_ENV;

const config = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-class-properties'],
        },
        exclude: /node_modules/
      }
    ]
  },
  output: {
    library: 'Reflow',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
  externals: {
    "react": 'React',
  },
};

// if (env === 'production') {
//   config.plugins.push(
//     new webpack.optimize.UglifyJsPlugin({
//       compressor: {
//         pure_getters: true,
//         unsafe: true,
//         unsafe_comps: true,
//         warnings: false
//       }
//     })
//   )
// }

module.exports = config