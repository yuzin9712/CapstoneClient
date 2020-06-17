const path = require("path");
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // 'webpack-hot-middleware/client',
    'babel-polyfill',
    path.resolve('src/index.js'),
  ],
  devtool: 'eval-source-map',
  devServer: {
    proxy: {
        '/api': {
            target: 'http://localhost:8001',
        },
        '/images': {
            target: 'https://swcap02.s3.ap-northeast-2.amazonaws.com',
            changeOrigin: true,
            pathRewrite: {'^/images': '/' }
        }
    },
    contentBase: path.resolve(__dirname, '../build'),
    index: "index.html",
    port: 8080,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../build"),
    publicPath: '/',
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        use: ["babel-loader?cacheDirectory"]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          'file-loader'
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new CleanWebpackPlugin()
  ],
  resolveLoader: {
    modules: [
      'node_modules',
    ],
  },  
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
};