const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const config = require('./webpack.config')
const { createProxyMiddleware } = require('http-proxy-middleware');
//테스트라!!!!
const app = express()
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
}))

app.use(webpackHotMiddleware(compiler))

app.use(
  '/images',
  createProxyMiddleware({
    target: 'https://swcap02.s3.ap-northeast-2.amazonaws.com',
    changeOrigin: true,
    pathRewrite: (path, req) => { return path.replace('/images', '/')}
  })
);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(8080, (err) => {
  if (err) {
    return console.error(err) // eslint-disable-line no-console
  }
  console.log('Listening at http://localhost:8080') // eslint-disable-line no-console
})
