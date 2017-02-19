var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var PROD = (process.env.NODE_ENV === "production");
var webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: "build",
    filename: PROD ? "index.min.js" : "index.js"
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /\.test\.js$/],
        loader: "jshint"
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css?modules&camelCase=dashes&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!csslint?failOnWarning=false")
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        include: __dirname + "/src",
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("index.min.css"),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
