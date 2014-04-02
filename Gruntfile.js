module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			build: {
				src: [
					'bower_components/angular/angular.min.js',
					'bower_components/angular-resource/angular-resource.min.js',
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/d3/d3.min.js',
					'bower_components/topojson/topojson.js',
					'app/js/app.js',
					'app/js/controllers.js',
					'app/js/directives.js',
					'app/js/filters.js',
					'app/js/services.js'
				],
				dest: 'app/js/build.js'
			},
		},
		sass: {
			build: {
				src: ['app/scss/*.scss'],
				dest: 'app/css/style.css',
				options: {
					outputStyle: 'nested'
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			sass: {
				files: 'app/scss/*.scss',
				tasks: 'sass:build'
			},
			js: {
				files: ['app/js/**/*.js', '!app/js/build.js'],
				tasks: 'concat:build'
			},
			html: {
				files: ['index.html', 'app/**/*.html']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat:build', 'sass:build']);

};