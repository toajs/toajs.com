'use strict'

const createError = require('http-errors')

exports.throw = function () {
  throw createError.apply(null, arguments)
}
