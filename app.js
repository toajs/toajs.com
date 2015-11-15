'use strict'

const Toa = require('toa')
const pm = require('toa-pm')
const config = require('config')
const toaMejs = require('toa-mejs')
const toaI18n = require('toa-i18n')
const toaBody = require('toa-body')
const toaCompress = require('toa-compress')

const ilog = require('./services/log')
const tools = require('./services/tools')
const router = require('./services/router')

/**
 * 启动服务
 */

const app = Toa(function *() {
  yield router.route(this)
}, function (err) {
  // API 请求错误默认处理
  if (this.path.startsWith('/api/')) return
  ilog.error(err.stack)
  // 其它错误请求重定向到 404
  this.redirect('/404')
  return true
})

app.onerror = ilog.error

// 添加 mejs render 方法: `this.render(tplName, valueObj)`
// 参考 https://github.com/toajs/toa-mejs
toaMejs(app, `${config.publicPath}/views/**/*.html`, {
  layout: 'layout',
  locals: {
    env: app.config.env,
    locale: function () {
      return this.locale
    },
    ua: function () {
      return this.clientInfo
    },
    __: function () {
      return this.__.apply(this, arguments)
    },
    __n: function () {
      return this.__n.apply(this, arguments)
    }
  }
})

toaI18n(app, {
  cookie: 'lang',
  locales: config.langs,
  directory: './locales'
})

// 添加请求内容解析方法：`this.parseBody()`
// 参考 https://github.com/toajs/toa-body
toaBody(app, {
  extendTypes: {
    json: ['application/x-javascript', 'application/y-javascript']
  }
})

app.use(toaCompress())
// 启动 server
module.exports = app.listen(config.port)
pm(app)

ilog.info({
  listen: config.port,
  appConfig: app.config
})
