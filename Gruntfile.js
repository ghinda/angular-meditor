'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    demo: 'public'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
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
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
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
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.demo)
            ];
          }
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '<%= yeoman.demo %>/*',
            '!<%= yeoman.demo %>/.git*'
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
    sass: {
      dist: {
        files: {
          '.tmp/styles/demo.css': '<%= yeoman.app %>/styles/demo.scss',
          '.tmp/styles/meditor.css': '<%= yeoman.app %>/styles/meditor.scss'
        }
      },
      server: {
        files: {
          '.tmp/styles/demo.css': '<%= yeoman.app %>/styles/demo.scss',
          '.tmp/styles/meditor.css': '<%= yeoman.app %>/styles/meditor.scss'
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/*.html',
      options: {
        dest: '<%= yeoman.demo %>'
      }
    },
    usemin: {
      html: [ '<%= yeoman.demo %>/{,*/}*.html' ],
      css: [ '<%= yeoman.demo %>/styles/{,*/}*.css' ],
      options: {
        dirs: [ '<%= yeoman.demo %>' ]
      }
    },
    htmlmin: {
      dist: {
        options: {},
        files: [{
          expand: true,
          cwd: '<%= yeoman.demo %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yeoman.demo %>'
        }]
      }
    },
    copy: {
      demo: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.demo %>',
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
          dest: '<%= yeoman.demo %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      min: {
        files: {
          '<%= yeoman.dist %>/meditor.min.css': '<%= yeoman.demo %>/styles/meditor.css',
          '<%= yeoman.dist %>/meditor.min.js': '<%= yeoman.demo %>/scripts/meditor.js'
        }
      },
      max: {
        files: {
          '<%= yeoman.dist %>/meditor.css': '.tmp/concat/styles/meditor.css',
          '<%= yeoman.dist %>/meditor.js': '.tmp/concat/scripts/meditor.js'
        }
      }
    },
    ngtemplates: {
      dist: {
        options: {
          usemin: '<%= yeoman.demo %>/scripts/meditor.js',
          module: 'angular-meditor'
        },
        cwd: '<%= yeoman.app %>',
        src: 'views/*.html',
        dest: '.tmp/scripts/templates.js'
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {}
      }
    },
    buildcontrol: {
      options: {
        dir: 'public',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      dist: {
        options: {
          remote: 'git@github.com:ghinda/angular-meditor.git',
          branch: 'gh-pages'
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'sass:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'sass:dist',
    'htmlmin',
    'useminPrepare',
    'ngtemplates',
    'copy:demo',
    'concat',
    'ngAnnotate',
    'copy:max',
    'cssmin',
    'uglify',
    'usemin',
    'copy:min',
    'jshint'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'buildcontrol'
  ]);
};
