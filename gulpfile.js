var gulp = require('gulp'); 
var gutil = require('gulp-util'); //  for console messages or errot
var coffee = require('gulp-coffee'); // work with coffee script
var mustache = require('gulp-mustache');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat'); // concate file and git return one file



var coffeeSources = ['components/coffee/tagline.coffee'];

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

// this task get all js file from one destination and concate them together and return in development folder scripts.js
gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('scripts.js'))
	.pipe(browserify())
	.pipe(gulp.dest('builds/development/js'))
});