module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: [
					'bower_components/jquery/dist/jquery.min.js',
					'bower_components/select2/select2.js',
					'bower_components/angular/angular.min.js',
					'bower_components/angular-resource/angular-resource.min.js',
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/angular-ui-select2/src/select2.js',
					'bower_components/d3/d3.min.js',
					'bower_components/topojson/topojson.js',
					'app/js/app.js',
					'app/js/controllers.js',
					'app/js/directives.js',
					'app/js/filters.js',
					'app/js/services.js'
				],
				dest: 'app/js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
        		banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      		},
			js: {
				src: '<%= concat.js.dest  %>',
				dest: 'app/js/<%= pkg.name %>.min.js'
			},
			css: {
				src: '<%= concat.css.dest  %>',
				dest: 'app/css/<%= pkg.name %>.min.css'

			}
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['bower_components/select2/select2.css', 'bower_components/select2/*.gif', 'bower_components/select2/*.png'],
						dest: 'app/css/vendor/select2'
					}

				]
			}
		},
		jshint: {
			build: {
				src: ['Gruntfile.js', 'app/js/**/*.js', '!app/js/<%= pkg.name %>.js', '!app/js/<%= pkg.name %>.min.js']
			}
		},
		sass: {
			build: {
				src: ['app/scss/*.scss'],
				dest: 'app/css/<%= pkg.name %>.css',
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
				files: ['app/js/**/*.js', '!app/js/prison-data.js', '!app/js/prison-data.min.js'],
				tasks: ['concat:js']
			},
			html: {
				files: ['index.html', 'app/**/*.html']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['sass', 'jshint', 'concat', 'copy']);
	grunt.registerTask('prod', ['sass', 'jshint', 'uglify', 'concat', 'jshint']);

};