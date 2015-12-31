var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var inline = require('gulp-inline-source');
var imageop = require('gulp-image-optimization');

gulp.task('scripts', function(){
	gulp.src('dev/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'));
	
	gulp.src('dev/js/lib/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/lib/'));
});


gulp.task('styles', function(){
	gulp.src('dev/css/*.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/css/'));
});


gulp.task('images', function(){
	gulp.src('dev/img/*')
		.pipe(imageop({
			optimizationLevel: 5
		}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('inline', function(){
	gulp.src('dev/*.html')
		.pipe(inline())
		.pipe(gulp.dest('dist/'));
});


gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});

gulp.task('default', ['scripts', 'styles', 'inline', 'images']);