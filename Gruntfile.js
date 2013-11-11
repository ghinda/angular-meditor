'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.loadNpmTasks('assemble');

	// configurable paths
	var yeomanConfig = {
		app: 'app',
		dist: 'dist'
	};

	try {
		yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
	} catch (e) {}

	grunt.initConfig({
		yeoman: yeomanConfig,
		watch: {
			assemble: {
				files: [ '<%= yeoman.app %>/templates/*.{hbs,html}' ],
				tasks: [ 'assemble:server' ]
			},
			sass: {
				files: [ '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}' ],
				tasks: [ 'sass:server' ]
			},
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%= yeoman.app %>/{,*/}*.html',
					'{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
					'{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
					'<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: '0.0.0.0'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			},
			test: {
				options: {
					middleware: function (connect) {
						return [
						mountFolder(connect, '.tmp'),
						mountFolder(connect, 'test')
						];
					}
				}
			},
			dist: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, './')
						];
					}
				}
			}
		},
		open: {
			server: {
				url: 'http://localhost:<%= connect.options.port %>'
			}
		},
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/{,*/}*.js'
			]
		},
		assemble: {
			options: {
				layoutdir: '<%= yeoman.app %>/templates',
				flatten: true
			},
			server: {
				files: {
					'.tmp/': [ '<%= yeoman.app %>/templates/**/*.hbs' ]
				}
			},
			dist: {
				files: {
					'./': [ '<%= yeoman.app %>/templates/**/*.hbs' ]
				}
			}
		},
		sass: {
			dist: {
				files: {
					'.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss',
					'.tmp/styles/meditor.css': '<%= yeoman.app %>/styles/meditor.scss'
				}
			},
			server: {
				options: {
					includePaths: [
						''
					]
				},
				files: {
					'.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss',
					'.tmp/styles/meditor.css': '<%= yeoman.app %>/styles/meditor.scss'
				}
			}
		},
		useminPrepare: {
			html: './*.html',
			options: {
				dest: './'
			}
		},
		usemin: {
			html: [ './{,*/}*.html' ],
			css: [ '<%= yeoman.dist %>/styles/{,*/}*.css' ],
			options: {
				dirs: [ '<%= yeoman.dist %>' ]
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {},
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: ['*.html', 'views/*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		// Put files not handled in other tasks here
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt,php,html}',
						'.htaccess',
						'bower_components/**/*',
						'images/{,*/}*.{gif,webp,svg}',
						'styles/fonts/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= yeoman.dist %>/images',
					src: [
						'generated/*'
					]
				}]
			}
		},
		concurrent: {
			server: [
				'sass:server',
				'assemble:server'
			],
			test: [
				'sass'
			],
			dist: [
				'sass:dist',
				'imagemin',
				'assemble:dist',
				'htmlmin'
			]
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		cdnify: {
			dist: {
				html: ['./*.html']
			}
		},
		ngtemplates: {
			dist: {
				options: {
					module: 'angular-meditor'
				},
				cwd: '<%= yeoman.app %>',
				src: 'views/**.html',
				dest: '.tmp/scripts/templates.js'
			}
		},
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>/scripts',
					src: '*.js',
					dest: '<%= yeoman.dist %>/scripts'
				}]
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= yeoman.dist %>/scripts/scripts.js': [
						'<%= yeoman.dist %>/scripts/scripts.js'
					]
				}
			}
		}
	});

	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'connect:test',
		'karma'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'ngtemplates',
		'concurrent:dist',
		'useminPrepare',
		'copy',
		'concat',
		'cdnify',
		'ngmin',
		'cssmin',
		'uglify',
		'usemin'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);
};
