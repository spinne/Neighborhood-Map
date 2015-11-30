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

	gulp.src('dev/views/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/views/js/'));
});


gulp.task('styles', function(){
	gulp.src('dev/css/print.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/css/'));

	gulp.src('dev/views/css/*.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/views/css/'));
});

gulp.task('images', function(){
	gulp.src('dev/img/*')
		.pipe(imageop({
			optimizationLevel: 5
		}))
		.pipe(gulp.dest('dist/img'));

	gulp.src('dev/views/images/*')
		.pipe(imageop({
			optimizationLevel: 5
		}))
		.pipe(gulp.dest('dist/views/images'));
});

gulp.task('inline', function(){
	gulp.src('dev/*.html')
		.pipe(inline())
		.pipe(gulp.dest('dist'));

	gulp.src('dev/views/*.html')
		.pipe(inline())
		.pipe(gulp.dest('dist/views'));
});

gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});

gulp.task('default', ['scripts', 'styles', 'images', 'inline']);