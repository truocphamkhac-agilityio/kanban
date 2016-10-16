const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const developmentConfig = require('./webpack.development.config');
const productionConfig = require('./webpack.production.config');
const stylelint = require('stylelint');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  public: path.join(__dirname, 'public'),
  entry: [
    path.join(__dirname, 'app', 'index.jsx')
  ]
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: PATHS.entry,
  output: {
    path: PATHS.public,
    filename: 'bundle.js'
  },
  resolve: {
    root: [path.resolve(__dirname, 'app')],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {
        test: /\.(css|scss)$/,
        loaders: ['postcss'],
        include: path.join(__dirname, 'app')
      },
      {
        test: /\.(js|jsx)?$/,
        loaders: ['eslint', 'jscs'],
        include: path.join(__dirname, 'app')
      }
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new CleanPlugin(PATHS.public),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'node_modules/html-webpack-template/index.ejs',
      title: 'Kanban app',
      appMountId: 'app',
      inject: false
    })
  ],
  postcss: function () {
    return [
      stylelint({
        rules: {
          'color-hex-case': 'lower'
        }
      })
    ];
  }
};


/**
 * development env
 */

if (TARGET === 'start' || !TARGET || TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, developmentConfig);
}

/**
 * production env
 */

if (TARGET === 'buildProd') {
  module.exports = merge(common, productionConfig);
}
