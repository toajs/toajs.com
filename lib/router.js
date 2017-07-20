'use strict'

const config = require('config')
const Router = require('toa-router')
const toaStatic = require('toa-static')

const indexView = require('./controller/get_index')

// 参考 https://github.com/toajs/toa-router
const router = module.exports = new Router()
const isDevelopment = process.env.NODE_ENV === 'development'

// 配置静态资源伺服模块
// 参考 https://github.com/toajs/toa-static
var staticModule = toaStatic({
  root: config.publicPath,
  maxCacheLength: isDevelopment ? -1 : 0
})

// 配置静态资源路由和 views 路由
router
  .get('/', function * () {
    this.set('cache-control', 'private')
    this.set('x-xss-protection', '1; mode=block')
    this.set('x-content-type-options', 'nosniff')
    yield indexView
  })
  .get('/static/:file*', staticModule)
  .get('/bower/:file*', staticModule)
  .otherwise(function * () {
    yield this.render('404', {
      message: this.path + 'is not found!'
    })
  })
