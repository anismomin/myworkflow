var gulp = require('gulp'); 
var gutil = require('gulp-util'); //  for console messages or errot
var coffee = require('gulp-coffee'); // work with coffee script
var mustache = require('mustache');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat'); // concate file and git return one file
var compass = require('gulp-compass');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minihtml = require('gulp-minify-html');
var minijson = require('gulp-jsonminify');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');

// for png
var pngquant = require('imagemin-pngquant');

//OR


var pngcrush = require('imagemin-pngcrush');
 

var env,
	coffeeSource,
	scssSource,
	HtmlSource,
	jsonSource,
	jsSource,
	outputDir,
	cssStyle;

env = process.env.NODE_ENV || 'development';

if( env === 'development') {
	outputDir = 'builds/development/'; 
	cssStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	cssStyle = 'expanded';
}

coffeeSources = ['components/coffee/tagline.coffee'];
scssSource = ['components/sass/style.scss'];
HtmlSource = [outputDir + '*.html'];
jsonSource = [outputDir + 'js/*.json'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];


gulp.task('image', function () {
    return gulp.src('builds/development/images/**/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        //use: [pngquant()]
        use: [pngcrush({reduce: true})]
    }))
    .pipe(gulp.dest('builds/production/images'));
});

// gulp.task('images', function () {
//     return gulp.src('builds/development/images/**/*.*')
//         .pipe(imageminPngcrush({reduce: true})())
//         .pipe(gulp.dest('builds/production/images'));
// });


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
	.pipe(gulpif( env === 'production' , uglify() ))
	.pipe(gulp.dest(outputDir +'js'))
	.pipe(connect.reload())
});

gulp.task('html', function(){
	gulp.src('builds/development/*.html')
	.pipe(gulpif( env === 'production', minihtml()))
	.pipe(gulp.dest(outputDir))
	.pipe(connect.reload())
});

gulp.task('json', function(){
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif( env === 'production', minijson()))
	.pipe(gulpif( env === 'production', gulp.dest('builds/production/js')))
	.pipe(connect.reload())
});

gulp.task('watch', function(){
	gulp.watch( coffeeSources , ['coffee']);
	gulp.watch( jsSources , ['js']);
	gulp.watch( 'builds/development/js/*.json' , ['json']);
	gulp.watch( 'builds/development/*.html' , ['html']);
	gulp.watch( 'components/sass/*.scss' , ['sass']);
	gulp.watch( 'builds/development/images/**/*.*' , ['image']);
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	})
});

gulp.task('default', ['html', 'image', 'json', 'coffee', 'sass', 'js', 'connect', 'watch'])
