var gulp = require('gulp')
var concat = require('gulp-concat')
var ubglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var sourcemap = require('gulp-sourcemaps')
var fs = require('fs')


fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
	require('./gulp/' + task)
})

gulp.task('welcome', function() {
	console.log('welcome')
})

// First argument is the function to call like: gulp hello
// this method depends on 'welcome'
gulp.task('hello', ['welcome'], function() {
	console.log('hello world')
})

gulp.task('js', function() {
	// has to load module.js first, then all others
	gulp.src(['ng/module.js', 'ng/**/*.js'])
	.pipe(sourcemap.init())
	.pipe(concat('app.js'))
	.pipe(ngAnnotate())			// avoid unintended compression
	.pipe(ubglify())			// compress code
	.pipe(sourcemap.write())  	// great for debugging
	.pipe(gulp.dest('assets'))
})


// Watchdog that runs gulp js anytime a .js file is updated
gulp.task('watch:js', ['js'], function() {
	gulp.watch('ng/**/*.js', ['js'])
})

// Watchdog that runs gulp js anytime a .css file is updated
gulp.task('watch:css', function() {
	gulp.watch('css/**/*.styl', ['css'])
})

gulp.task('dev', ['watch:css', 'watch:js', 'dev:server'])