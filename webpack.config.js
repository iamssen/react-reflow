const webpack = require('webpack');
const env = process.env.NODE_ENV;

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};
const reactDomExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom'
};
const rxjsExternal = {
  root: 'Rx',
  commonjs2: 'rxjs',
  commonjs: 'rxjs',
  amd: 'rxjs'
}

const config = {
  devtool: 'source-map',
  externals: {
    react: reactExternal,
    reactDom: reactDomExternal,
    rxjs: rxjsExternal
  },
  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/,
        loaders: ['ts-loader'],
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    root: ['./src'],
    extensions: ['', '.ts', '.tsx']
  },
  output: {
    library: 'Reflow',
    libraryTarget: 'umd'
  },
  plugins: [
    {
      apply: compiler => {
        compiler.parser.plugin('expression global', () => {
          this.state.module.addVariable('global', '(function() { return this; }()) || Function(\'return this\')()');
          return false;
        });
      }
    },
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  ]
};

module.exports = config;