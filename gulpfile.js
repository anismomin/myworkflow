var gulp = require('gulp'); 
var gutil = require('gulp-util'); //  for console messages or errot
var coffee = require('gulp-coffee'); // work with coffee script
var mustache = require('mustache');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat'); // concate file and git return one file
var compass = require('gulp-compass');
var connect = require('gulp-connect');


var coffeeSources = ['components/coffee/tagline.coffee'];

var scssSource = ['components/sass/style.scss'];

var HtmlSource = ['builds/development/*.html'];

var JsonSource = ['builds/development/js/*.json'];

var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

// in this task we take coffe script file and pass throught coffe script plugin 
// that check for error if any error found add to console.or return to same destination
gulp.task('coffee', function(){
	gulp.src(coffeeSources)
	.pipe(coffee({ bare: true })
		.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
});


gulp.task('sass', function(){
	gulp.src(scssSource)
	.pipe(compass({ 
		sass: 'components/sass',
      	image: 'builds/development/images',
      	style: 'expanded'
	})
	.on('error', gutil.log))
	.pipe(gulp.dest('builds/development/css'))
	.pipe(connect.reload())
});

// this task get all js file from one destination and concate them together and return in development folder scripts.js
gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulp.dest('builds/development/js'))
	.pipe(connect.reload())
});

gulp.task('html', function(){
	gulp.src(HtmlSource)
	.pipe(connect.reload())
});

gulp.task('json', function(){
	gulp.src(JsonSource)
	.pipe(connect.reload())
});

gulp.task('watch', function(){
	gulp.watch( coffeeSources , ['coffee']);
	gulp.watch( jsSources , ['js']);
	gulp.watch( JsonSource , ['json']);
	gulp.watch( HtmlSource , ['html']);
	gulp.watch( 'components/sass/*.scss' , ['sass']);
});

gulp.task('connect', function(){
	connect.server({
		root: 'builds/development',
		livereload: true
	})
});

gulp.task('default', ['html', 'json', 'coffee', 'sass', 'js' ,'connect', 'watch'])