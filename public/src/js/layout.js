define(function(require, exports, module) {

  var Layout = (function() {

    function layout (options) {
      this.options = options;
      this.initialize();
    }

    layout.prototype.initialize = function() {
      this.ripples();
    }

    // Config ripple DOMs
    layout.prototype.ripples = function() {
      $.material.options.withRipples = [
        '.btn:not(.btn-link)',
        '.card-image',
        '.nav-handler a',
        '.dropdown-menu a',
        '.pagination a',
        '.nav-tabs a:not(.withoutripple)',
        '.withripple'
      ].join(',');
      $.material.ripples();
      return this;
    }

    return layout;

  })();

  return Layout;

});
