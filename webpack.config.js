var ExtractTextPlugin = require("extract-text-webpack-plugin");
var PROD = (process.env.NODE_ENV === "production");
var webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: "build",
    filename: PROD ? "index.min.js" : "index.js"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css?modules&camelCase=dashes&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]")
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
    new ExtractTextPlugin("index.css"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
