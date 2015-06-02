'use strict'
/* global module, define, $ */

define(function (require, exports, module) {
  var Util = {}

  Util.slideTo = function (element, top, adjust) {
    var scrollTop, winHeight
    if (!adjust) {
      adjust = 0
    }
    winHeight = $(window).height()
    if (top) {
      scrollTop = element.offset().top - adjust
    } else {
      scrollTop = element.offset().top + element.outerHeight() + adjust - winHeight
    }
    return $('body').animate({
      scrollTop: scrollTop
    }, 300)
  }

  return Util
})
