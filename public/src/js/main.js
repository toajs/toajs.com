'use strict';
/* global module, define */

require.config({
  paths: {
    'jquery': '../../bower/jquery/dist/jquery',
    'jquery-sticky': '../../bower/jquery-sticky/jquery.sticky',
    'jquery-typed': '../../bower/typed.js/dist/typed.min',
    'bootstrap': '../../bower/bootstrap/dist/js/bootstrap',
    'bootstrap-md': '../../bower/bootstrap-material-design/dist/js/material',
    'ripples': '../../bower/bootstrap-material-design/dist/js/ripples',
    'particles': '../../bower/particles.js/particles',
    'ScrollMagic': '../../bower/scrollmagic/scrollmagic/uncompressed/ScrollMagic',
    'TweenMax': '../../bower/gsap/src/uncompressed/TweenMax',
    'TimelineMax': '../../bower/gsap/src/uncompressed/TweenMax',
    'animation-gsap': '../../bower/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap',
    'thunks': '../../bower/thunks/thunks',
    'hirouter': '../../bower/hirouter/dist/router',

    'components': './components',
    'controllers': './controllers',
    'utils': './utils'
  },
  shim: {
    'jquery-sticky': ['jquery'],
    'jquery-typed': ['jquery'],
    'bootstrap': ['jquery'],
    'bootstrap-md': ['jquery'],
    'ripples': ['jquery']
  }
});

require([
  'jquery',
  'thunks',
  'layout',
  'router',

  'jquery-sticky',
  'jquery-typed',
  'bootstrap',
  'bootstrap-md',
  'particles',
  'ripples'
], function(
  $,
  Thunks,
  Layout,
  Router
) {

  // Init Layout
  new Layout();

  // Init router
  new Router();

});
