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
                    'dist/popup-form.html': 'popup-form.html.slim',
                    'dist/popup-size.html': 'popup-size.html.slim',
                    'dist/popup-main.html': 'popup-main.html.slim'
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
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('default', ['sass']);
    grunt.registerTask('default', ['imagemin']);

};
