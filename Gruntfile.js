module.exports = function(grunt) {

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
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'dist/images/',
                }]
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'javascripts/size.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        coffee: {
            dist: {
                files: {
                    'javascripts/background.js': 'coffee/background.coffee',
                    'javascripts/size.js': 'coffee/size.coffee'
                }
            }
        },
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'javascripts/',
                    src: '**/*.js',
                    dest: 'dist/javascripts/'
                }]
            }
        },
        slim: {
            dist: {
                files: {
                    'dist/popup-form.html': 'slim/popup-form.html.slim',
                    'dist/popup-size.html': 'slim/popup-size.html.slim',
                    'dist/popup-main.html': 'slim/popup-main.html.slim'
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'dist/stylesheets/style.css': 'stylesheets/style.scss'
                }
            }
        },
        'json-format': {
            test: {
                options: {
                    indent: 2,
                    remove: ['_comment']
                },
                files: [{
                    expand: true,
                    src: ['manifest.json'],
                    dest: 'dist/'
                }]
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
