'use strict';
/* global module, define, particlesJS */

define(function(require, exports, module) {

  var ScrollMagic   = require('ScrollMagic');
  var TweenMax      = require('TweenMax');
  // var TimelineMax   = require('TimelineMax');
  // var AnimationGsap = require('animation-gsap');
  var Util          = require('utils/util');

  function PageIndex (options) {
    this.options = options;
    this.initialize();
  }

  PageIndex.prototype.initialize = function() {
    this
      .renderBasic()
      .bindEvents()
      .headingBg()
      .headerSticky()
      .buildLink()
      .scrollSpy()
      .scrollMagic();
  };

  PageIndex.prototype.renderBasic = function() {
    this.$BODY          = $('body');
    this.$header        = $('.site-header');
    this.$terminal      = $('.terminal-window');
    this.$documentation = $('.documentation');

    this.adjust = this.$header.outerHeight();
    return this;
  };

  PageIndex.prototype.buildLink = function() {
    var $a = $('a', this.$documentation);
    $a.each(function(){
      $(this).attr('data-hover', $(this).text());
    });
    return this;
  };

  PageIndex.prototype.bindEvents = function() {
    var self = this;

    self.$header.on('click', 'a', function(e) {
      e.preventDefault();
      var hash = $(this).attr('href');
      if (hash) {
        if (hash.match(/^#.*/)) {
          var $target = $(hash);
          Util.slideTo($target, true, self.adjust);
          history.pushState(null, null, location.href.replace(/#.*$/, '') + hash);
        } else {
          window.open(hash);
        }
      }
    });

    return this;
  };

  PageIndex.prototype.npmInstall = function() {
    var data = [
      {
        action: 'type',
        strings: ["npm install toa^400"],
        output: '<span class="gray">+toa@0.9.2 installed</span><br>&nbsp;',
        postDelay: 1000
      },
      {
        action: 'type',
        strings: ["vi app.js^400"],
        output: '<span class="gray">Copy "Hello world" snippet to app.js<br>&nbsp;',
        postDelay: 1000
      },
      {
        action: 'type',
        strings: ['node app^400'],
        output: $('.run-output').html()
      },
      {
        action: 'type',
        strings: ["that was easy !"],
        postDelay: 2000
      }
    ];

    var ctx = this;
    function runScripts(data, pos) {
      var $prompt = $('.prompt', ctx.$terminal),
          script = data[pos];
      if (script.clear === true) {
        $('.history', ctx.$terminal).html('');
      }
      switch(script.action) {
        case 'type':
          // cleanup for next execution
          $prompt.removeData();
          $('.typed-cursor', ctx.$terminal).text('');
          $prompt.typed({
            strings: script.strings,
            typeSpeed: 30,
            callback: function() {
              var history = $('.history', ctx.$terminal).html();
              history = history ? [history] : [];
              history.push('$ ' + $prompt.text());
              if(script.output) {
                history.push(script.output);
                $prompt.html('');
                $('.history', ctx.$terminal).html(history.join('<br>'));
              }
              // scroll to bottom of screen
              $('.terminal-main').scrollTop($('.terminal-main').height());
              // Run next script
              pos++;
              if(pos < data.length) {
                setTimeout(function() {
                  runScripts(data, pos);
                }, script.postDelay || 1000);
              }
            }
          });
          break;
        case 'view':
          break;
      }
    }

    runScripts(data, 0);
    return this;
  };

  /*jshint -W106*/
  PageIndex.prototype.headingBg = function() {
    particlesJS('heading', {
      particles: {
        color: '#d8e0ff',
        shape: 'circle',
        opacity: 1,
        size: 2.8,
        size_random: true,
        nb: 25,
        line_linked: {
          enable_auto: true,
          distance: 250,
          color: '#90a6ff',
          opacity: 0.6,
          width: 1,
          condensed_mode: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        },
        anim: {
          enable: true,
          speed: 2
        }
      },
      interactivity: {
        enable: true,
        mouse: {
          distance: 250
        },
        detect_on: 'canvas',
        mode: 'grab',
        line_linked: {
          opacity: 0.8
        },
        events: {
          onclick: {
            push_particles: {
              enable: true,
              nb: 4
            }
          }
        }
      },
      retina_detect: true
    });
    return this;
  };

  PageIndex.prototype.opening = function() {
    TweenMax.staggerFromTo(
      '.introduction .sub-card',
      0.3,
      {
        y: 80,
        x: -10,
        opacity: 0
      },
      {
        y: 0,
        x: 0,
        opacity: 1
      },
      0.15
    );
    return this;
  };

  // Make header sticky
  PageIndex.prototype.headerSticky = function() {
    this.$header.sticky({topSpacing: 0});
    return this;
  };

  PageIndex.prototype.scrollSpy = function() {
    this.$BODY.scrollspy({
      target: '.site-header .navbar-header',
      offset: this.adjust + 1
    });
    return this;
  };

  PageIndex.prototype.scrollMagic = function() {
    var self = this;

    /* Init container */
    var smCtrl = new ScrollMagic.Controller({
      globalSceneOptions: {
        triggerHook: 'onLeave'
      }
    });

    // Get started
    var getStartedScene = new ScrollMagic.Scene({
      triggerElement: '.get-started',
      duration: 0,
      offset: -250,
      reverse: false
    })
    .setTween(TweenMax.staggerFromTo(
      '.terminal-window',
      0.5,
      {
        y: 200,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1
      }
    ))
    .on('enter', function(e){
      setTimeout(function(){
        self.npmInstall();
      }, 1000);
    })
    .addTo(smCtrl);

    return this;
  };

  return PageIndex;
});
