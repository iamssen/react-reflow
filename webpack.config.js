const webpack = require('webpack');
const path = require('path');

const external = (root, module) => ({
  root,
  commonjs2: module,
  commonjs: module,
  amd: module,
});

module.exports = (env) => new Promise(resolve => {
  const reflow = {
    devtool: 'source-map',
    
    entry: () => './src/index.ts',
    
    externals: {
      'react': external('React', 'react'),
      'react-dom': external('ReactDOM', 'react-dom'),
      'rxjs': external('Rx', 'rxjs'),
    },
    
    output: {
      filename: env.minify === 'true' ? 'lib/reflow.min.js' : 'lib/reflow.js',
      library: 'Reflow',
      libraryTarget: 'umd'
    },
    
    resolve: {
      extensions: ['.ts', '.tsx']
    },
    
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {loader: 'ts-loader'}
          ],
          include: file => {
            return file.indexOf(path.resolve(__dirname, 'src')) === 0;
          },
        }
      ],
    },
    
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
    ]
  };
  
  if (env.minify === 'true') {
    reflow.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      })
    );
  }
  
  resolve([reflow]);
});