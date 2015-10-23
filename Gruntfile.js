module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            dist: [
                'dist'
            ]
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
            compile: {
                files: {
                    'javascripts/size.js': 'coffee/size.coffee',
                    'javascripts/content.js': 'coffee/content.coffee'
                }
            }
        },
        slim: {
            compile: {
                files: {
                    'popup-form.html': 'popup-form.html.slim',
                    'popup-size.html': 'popup-size.html.slim',
                    'popup-main.html': 'popup-main.html.slim'
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'style.css': 'stylesheets/style.scss'
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
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('default', ['sass']);
    grunt.loadNpmTasks('grunt-slim');
};
