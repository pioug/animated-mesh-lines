const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const fs = require('fs');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const poststylus = require('poststylus');


// Paths
const distPath = path.resolve(__dirname, '../dist');
const nodeModulesPath = path.resolve(__dirname, './node_modules');
const demosPath = path.resolve(__dirname, '../app/demos');

// Init props
const entries = {};
const plugins = [
  new webpack.LoaderOptionsPlugin({
    debug: true,
    options: {
      stylus: {
        use: [poststylus(['autoprefixer'])],
      },
    },
  }),
];

// * WEBPACK CONFIG
const webpackCommunConfig = {
  // node: {
  //   fs: 'empty'
  // },
  mode: 'development',
  entry: `${demosPath}/demo4/animation.js`,
  output: {
    filename: '[name].js',
    path: distPath,
    libraryTarget: 'umd'
    // publicPath: myLocalIp,
    // publicPath: '/',
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, '../app/app.js'),
      utils: path.resolve(__dirname, '../app/utils'),
      objects: path.resolve(__dirname, '../app/objects'),
      decorators: path.resolve(__dirname, '../app/decorators'),
    },
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: nodeModulesPath,
    },
    {
      test: /\.(styl|css)$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            // sourceMap: true
          },
        },
        {
          loader: 'css-loader',
          options: {
            // sourceMap: true
          },
        },
        {
          loader: 'stylus-loader',
          options: {
            // sourceMap: true
          },
        },
      ],
    },
    // {
    //   test: /\.(png|jpe?g|gif)$/,
    //   loader: 'file-loader?name=imgs/[hash].[ext]',
    // },
    // {
    //   test: /\.(eot|svg|ttf|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    //   loader: 'file-loader?name=fonts/[name].[ext]',
    // },
    {
      test: /\.(glsl|frag|vert)$/,
      exclude: nodeModulesPath,
      loader: 'raw-loader'
    },
    {
      test: /\.(glsl|frag|vert)$/,
      exclude: nodeModulesPath,
      loader: 'glslify-loader'
    }],
  },
  plugins: plugins,
};


// HACK
// Inject into the css the extracter loader instead of the style-loader
webpackCommunConfig.module.rules[1].use[0] = MiniCssExtractPlugin.loader;

// MERGE
module.exports = merge(webpackCommunConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin([webpackCommunConfig.output.path], { root: path.resolve(__dirname, '..'), verbose: true }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: 'vendors.css',
    }),
  ],
  optimization: {
    nodeEnv: 'production',
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },
});
