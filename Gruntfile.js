module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      app:          {
        src:        'lib/dvid.js',
        dest:       'build/dvid.js',
        options: {
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/dvid.js',
        dest: 'build/dvid.min.js'
      }
    },
    mochaTest: {
      test: {
        options: {},
        src: ['test/**/*.js']
      }
    },
    jsdoc: {
      dist: {
        src: ['lib/**/*.js', 'README.md', 'package.json'],
        options: {
          desintation: 'doc',
          template : "node_modules/ink-docstrap/template"
        }
      }
    },
    watch: {
      scripts: {
        files: ['lib/**/*.js'],
        tasks: ['browserify', 'uglify', 'jsdoc']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['browserify','uglify']);
  grunt.registerTask('test', ['browserify','mochaTest']);
  grunt.registerTask('docs', ['jsdoc']);

};
