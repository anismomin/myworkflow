var gulp = require('gulp'); 
var gutil = require('gulp-util'); //  for console messages or errot
var coffee = require('gulp-coffee'); // work with coffee script
var mustache = require('mustache');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat'); // concate file and git return one file
var compass = require('gulp-compass');
var connect = require('gulp-connect');


var env,
	coffeeSource,
	scssSource,
	HtmlSource,
	JsonSource,
	jsSource,
	outputDir,
	cssStyle;

env = process.env.NODE_ENV || 'development';

if( env === 'development') {
	outputDir = 'builds/development/'; 
	cssStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	cssStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
scssSource = ['components/sass/style.scss'];
HtmlSource = [outputDir + '*.html'];
JsonSource = [outputDir + 'js/*.json'];
jsSources = [
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
      	image: outputDir +'images',
      	style: cssStyle
	})
	.on('error', gutil.log))
	.pipe(gulp.dest(outputDir +'css'))
	.pipe(connect.reload())
});

// this task get all js file from one destination and concate them together and return in development folder scripts.js
gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulp.dest(outputDir +'/js'))
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
		root: outputDir,
		livereload: true
	})
});

gulp.task('default', ['html', 'json', 'coffee', 'sass', 'js' ,'connect', 'watch'])