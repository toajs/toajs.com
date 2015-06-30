'use strict'

const config = require('config')
const Router = require('toa-router')
const toaStatic = require('toa-static')
const toaFavicon = require('toa-favicon')

const indexView = require('../controllers/getIndex')

// 参考 https://github.com/toajs/toa-router
const router = module.exports = new Router()

// 配置 favicon 模块
// 参考 https://github.com/toajs/toa-favicon
const faviconModule = toaFavicon(config.publicPath + '/static/images/favicon.ico')

const isDevelopment = process.env.NODE_ENV === 'development'

// 配置静态资源伺服模块
// 参考 https://github.com/toajs/toa-static
var staticModule = toaStatic({
  root: config.publicPath,
  maxCacheLength: isDevelopment ? -1 : 0
})

// 配置静态资源路由和 views 路由
router
  .get('/', function *() {
    this.set('Cache-Control', 'private')
    this.set('X-XSS-Protection', '1; mode=block')
    this.set('X-Content-Type-Options', 'nosniff')
    yield indexView
  })
  .get('/static|bower/(*)', function *() {
    yield staticModule
  })
  .get('/favicon.ico', function *() {
    yield faviconModule
  })
  .otherwise(function *() {
    yield this.render('404', {
      message: this.path + 'is not found!'
    })
  })
