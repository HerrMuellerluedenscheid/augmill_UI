var gulp = require('gulp')
var stylus = require('gulp-stylus')


// compile css files
gulp.task('css', function () {
	gulp.src('css/**/*.styl')
	.pipe(stylus())
	.pipe(gulp.dest('assets'))
})