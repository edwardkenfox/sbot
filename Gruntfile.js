module.exports = function (grunt) {

  grunt.initConfig({
    clean: {
      dist: [
        'dist'
      ]
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'dev/images/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'dist/images/',
        }]
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'dev/javascripts/size.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    coffee: {
      dist: {
        files: {
          'dev/javascripts/background.js': 'dev/coffee/background.coffee',
          'dev/javascripts/size.js': 'dev/coffee/size.coffee',
          'dev/javascripts/pref.js': 'dev/coffee/pref.coffee'
        }
      }
    },
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dev/javascripts/',
          src: '**/*.js',
          dest: 'dist/javascripts/'
        }]
      }
    },
    slim: {
      dist: {
        files: {
          'dist/popup-form.html': 'dev/slim/popup-form.html.slim',
          'dist/popup-size.html': 'dev/slim/popup-size.html.slim',
          'dist/popup-main.html': 'dev/slim/popup-main.html.slim'
        }
      }
    },
    sass: {
      dist: {
        files: {
          'dist/stylesheets/style.css': 'dev/stylesheets/style.scss'
        }
      }
    },
    'json-format': {
      dist: {
        options: {
          indent: 2,
          remove: ['_comment']
        },
        files: {

          'dist/manifest.json': 'dev/manifest.json'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint'],
      sass: {
        files: 'sass/**/*.scss',
        tasks: ['sass']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean'); // clean build folder
  grunt.loadNpmTasks('grunt-slim'); // export slim to html
  grunt.loadNpmTasks('grunt-contrib-sass'); // export stylesheet to css
  grunt.loadNpmTasks('grunt-contrib-imagemin'); // export images
  grunt.loadNpmTasks('grunt-contrib-uglify'); //minify and export js
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-json-format');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.registerTask('dist', ['clean', 'jshint', 'coffee', 'uglify', 'sass', 'slim', 'imagemin', 'json-format']);

};
