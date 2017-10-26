/// <binding BeforeBuild='sass' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/
"use strict";
var gulp = require("gulp"),
	rimraf = require("rimraf"),
	sass = require("gulp-sass");
var paths = {
	webroot: "./wwwroot/"
};
gulp.task('sass', function () {
	return gulp.src('wwwroot/css/style.scss')
		.pipe(sass())
		.pipe(gulp.dest(paths.webroot + '/dist'));
});

/// <binding BeforeBuild='sass' />
//
