var hasProp = {}.hasOwnProperty;
var extend  = function(child, parent) {
    for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

define(function(require, exports, module) {

  var Router;
  var HiRouter  = require('hirouter');
  var PageIndex = require('controllers/index');

  return Router = (function(superClass) {
    extend(Router, superClass);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
      this.defineRoutes().start({
        pushState: false
      });
    }

    Router.prototype.defineRoutes = function() {
      this.when('/', function() {
        return new PageIndex();
      }).otherwise(function() {
        return new PageIndex();
      });
      return this;
    };

    Router.prototype.always = function(handler) {
      this.alwayshandler = handler;
      return this;
    };

    Router.prototype.route = function(fragment) {
      fragment = fragment.replace(/^\//, '');
      if (fragment.indexOf(this.root) !== 0) return false;
      if (this.root.length > 1) fragment = fragment.slice(this.root.length);
      var urlObj = this.parsePath(fragment);
      var matched = this.trie.match(urlObj.pathName);
      if (matched) {
        urlObj.params = matched.params;
        matched.node.handler(urlObj);
        if (this.alwayshandler) {
          this.alwayshandler(urlObj);
        }
      } else if (this.otherwiseHandler)
        this.otherwiseHandler(urlObj);
      else return false;
      return true;
    };

    return Router;

  })(HiRouter);

});
