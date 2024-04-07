const gulp = require('gulp')
const javascriptObfuscator = require('gulp-javascript-obfuscator')

function defaultTask(cb) {
	gulp.src('./mock_api/mockExperiment.js')
	    .pipe(javascriptObfuscator())
	    .pipe(gulp.dest('./public/'));
	cb()
}

exports.default = defaultTask
