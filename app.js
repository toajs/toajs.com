'use strict';
/*jshint -W124*/

const util = require('util');

const Toa = require('toa');
const config = require('config');
const toaMejs = require('toa-mejs');
const toaI18n = require('toa-i18n');
const toaBody = require('toa-body');
const toaCompress = require('toa-compress');

const tools = require('./services/tools');
const router = require('./services/router');
const packageInfo = require('./package.json');

// var memwatch = require('memwatch');
// memwatch.on('leak', function(info) {
//   console.log(info);
// });

/**
 * 启动服务
 */

const app = Toa(function*(Thunk) {
  yield router.route(this, Thunk);
}, function(err) {
  // API 请求错误默认处理
  if (this.path.startsWith('/api/')) return;
  console.error(err.stack);
  // 其它错误请求重定向到 404
  this.redirect('/404');
  return true;
});

app.onerror = tools.logErr;

// 添加 ejs render 方法: `this.render(tplName, valueObj)`
// 参考 https://github.com/toajs/toa-mejs
toaMejs(app, `${config.publicPath}/views/**/*.html`, {
  layout: 'layout',
  locals: {
    env: app.config.env,
    locale: function() {
      return this.locale;
    },
    ua: function() {
      return this.clientInfo;
    },
    __: function() {
      return this.__.apply(this, arguments);
    },
    __n: function() {
      return this.__n.apply(this, arguments);
    }
  }
});

toaI18n(app, {
  cookie: 'lang',
  locales: config.langs,
  directory: './locales'
});

// 添加请求内容解析方法：`this.parseBody()`
// 参考 https://github.com/toajs/toa-body
toaBody(app, {
  extendTypes: {
    json: ['application/x-javascript', 'application/y-javascript']
  }
});

app.use(toaCompress());
// 启动 server
module.exports = app.listen(config.port);

tools.logInfo('app:', {
  listen: config.port,
  appConfig: app.config
});
