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
    watch: {
      scripts: {
        files: ['lib/**/*.js'],
        tasks: ['browserify', 'uglify', 'jasmine']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', ['browserify','uglify']);
  grunt.registerTask('test', ['browserify','mochaTest']);

};
