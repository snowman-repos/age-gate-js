var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: "build",
    filename: "index.js"
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
        include: [
          __dirname + "/src",
          __dirname + "/test"
        ],
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("index.css")
  ]
}
