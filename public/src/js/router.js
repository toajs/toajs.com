'use strict'
/* global module, define */

define(function (require, exports, module) {
  var HiRouter = require('hirouter')
  var PageIndex = require('controllers/index')

  function router () {
    return new HiRouter()
      .when('/', function () {
        return new PageIndex()
      })
      .otherwise(function () {
        return new PageIndex()
      })
      .start({pushState: false})
  }

  return router
})
