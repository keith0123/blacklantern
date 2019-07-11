const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test:/\.(s*)css$/,
        use:['style-loader','css-loader', 'sass-loader']
     }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname, "../"),
      cleanStaleWebpackAssets: false
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new CopyWebpackPlugin([
      {
        context: path.join(__dirname, '../src'),
        from: 'assets',
        to: 'assets'
      },
      {
        context: path.join(__dirname, '../'),
        from: 'public',
        to: ''
      }
    ])
  ]
};
