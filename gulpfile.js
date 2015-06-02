'use strict'

var gulp = require('gulp')
var config = require('config')
var merge2 = require('merge2')
var rjs = require('gulp-rjs2')
var less = require('gulp-less')
var clean = require('gulp-rimraf')
var hljs = require('highlight.js')
var rename = require('gulp-rename')
var nodemon = require('gulp-nodemon')
var md = require('gulp-remarkable')
var uglify = require('gulp-uglify')
var Revall = require('gulp-rev-all')
var plumber = require('gulp-plumber')
var sequence = require('gulp-sequence')
var concatCss = require('gulp-concat-css')
var minifyCSS = require('gulp-minify-css')
var livereload = require('gulp-livereload')
var autoprefixer = require('gulp-autoprefixer')

var echoErrorAndEnd = function (err) {
  console.log(err)
  return this.emit('end')
}

gulp.task('clean', function () {
  return gulp.src([
      'public/views',
      'public/dist',
      'public/static'
    ], {read: false})
    .pipe(clean({force: true}))
})

gulp.task('fonts', function () {
  return gulp.src([
    'public/bower/bootstrap-material-design/fonts/**',
    'public/src/fonts/**'
  ])
    .pipe(gulp.dest('public/static/fonts'))
})

gulp.task('less', function () {
  return gulp.src('public/src/less/app.less')
    .pipe(plumber())
    .pipe(less().on('error', echoErrorAndEnd))
    .pipe(autoprefixer('last 2 versions', {
      map: false
    }))
    .pipe(gulp.dest('public/static/css'))
    .pipe(livereload())
})

gulp.task('libCss', function () {
  return gulp.src(['public/src/less/lib/**'])
    .pipe(plumber())
    .pipe(less().on('error', echoErrorAndEnd))
    .pipe(autoprefixer('last 2 versions', {
      map: false
    }))
    .pipe(concatCss('lib.css'))
    .pipe(gulp.dest('public/static/css'))
    .pipe(livereload())
})

gulp.task('js', function () {
  return gulp.src('public/src/js/**/*.js')
    .pipe(gulp.dest('public/static/js'))
    .pipe(livereload())
})

gulp.task('images', function () {
  return gulp.src('public/src/images/**')
    .pipe(gulp.dest('public/static/images'))
})

gulp.task('views', function () {
  return gulp.src('public/src/views/**/*.html')
    // .pipe(ejsmin({removeComment: true}))
    .pipe(gulp.dest('public/views'))
})

gulp.task('md', function () {
  return gulp.src('public/src/docs/guide.md')
    .pipe(md({
      preset: 'full',
      disable: ['replacements'],
      remarkableOptions: {
        typographer: true,
        linkify: true,
        breaks: true,
        html: true
      },
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (err) {}
        }
        try {
          return hljs.highlightAuto(str).value
        } catch (err) {}

        return '' // use external default escaping
      }
    }))
    .pipe(rename('guide-old.html'))
    .pipe(gulp.dest('public/views/docs'))
})

gulp.task('rjs-lib', function () {
  return rjs({
    baseUrl: 'public/static/js',
    mainConfigFile: 'public/static/js/main.js',
    name: '../../bower/almond/almond',
    out: 'js/lib.js',
    include: ['libraries'],
    insertRequire: ['libraries'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: false
  })
    .pipe(uglify())
    .pipe(gulp.dest('public/static'))
})

gulp.task('rjs-app', function () {
  return rjs({
    baseUrl: 'public/static/js',
    mainConfigFile: 'public/static/js/main.js',
    name: 'main',
    out: 'js/app.js',
    exclude: ['libraries'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: true
  })
    .pipe(uglify())
    .pipe(gulp.dest('public/static'))
})

gulp.task('rev', function () {
  var revall = new Revall({
    prefix: config.cdnPrefix,
    dontGlobal: [/\/favicon\.ico$/],
    dontRenameFile: [/\.html$/],
    dontUpdateReference: [/\.html$/],
    dontSearchFile: [/\.js$/]
  })

  return merge2(
    gulp.src('public/views/**/*.html'),
    gulp.src('public/static/css/*.css').pipe(minifyCSS({rebase: false})),
    gulp.src([
      'public/static/js/app.js',
      'public/static/js/lib.js'
    ]).pipe(uglify()),
    gulp.src([
      'public/static/images/**',
      'public/static/fonts/**'
    ])
  )
    .pipe(revall.revision())
    .pipe(gulp.dest('public/dist'))
})

gulp.task('watch', function () {
  livereload.listen()
  gulp.watch('public/src/js/**/*.js', ['js'])
  gulp.watch('public/src/views/**/*.html', ['views'])
  gulp.watch('public/src/less/**/*.less', ['less', 'libCss'])
  gulp.watch('public/src/images/**', ['images'])
})

gulp.task('dev', sequence('clean', ['js', 'less', 'fonts', 'images', 'views', 'libCss']))

gulp.task('build', sequence('dev', ['rjs-lib', 'rjs-app'], 'rev'))

gulp.task('default', sequence('dev'))

gulp.task('serv', ['watch'], function () {
  return nodemon({
    script: 'app.js',
    watch: ['public/views', 'locales'],
    ext: 'js json html',
    env: {'NODE_ENV': 'development'}
  }).on('restart', function () {
    var now
    now = new Date()
    console.log('[' + (now.toLocaleTimeString()) + '] [nodemon] Server restarted!')
    // Auto refresh index after restart server.
    setTimeout(function () {
      livereload.reload()
    }, 800)
  })
})
