'use strict'

const Toa = require('toa')
const pm = require('toa-pm')
const config = require('config')
const toaMejs = require('toa-mejs')
const toaI18n = require('toa-i18n')
const toaBody = require('toa-body')
const toaFavicon = require('toa-favicon')
const toaCompress = require('toa-compress')

const ilog = require('ilog')
const router = require('./router')

ilog.level = config.logLevel
/**
 * 启动服务
 */

const app = module.exports = Toa()

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

// 配置 favicon 模块
// 参考 https://github.com/toajs/toa-favicon
app.use(toaFavicon(config.publicPath + '/static/images/favicon.ico'))
app.use(toaCompress())
app.use(router.toThunk())
// 启动 server
app.listen(config.port, function () {
  ilog.info({
    listen: config.port,
    appConfig: app.config
  })
})
pm(app)
