'use strict'
/* global module, define, $ */

define(function (require, exports, module) {
  function Layout (options) {
    this.options = options
  }

  Layout.prototype.initialize = function () {
    this.ripples()
  }

  // Config ripple DOMs
  Layout.prototype.ripples = function () {
    $.material.options.withRipples = [
      '.btn:not(.btn-link)',
      '.card-image',
      '.nav-handler a',
      '.dropdown-menu a',
      '.pagination a',
      '.nav-tabs a:not(.withoutripple)',
      '.withripple'
    ].join(',')
    $.material.ripples()
    return this
  }

  return Layout
})
