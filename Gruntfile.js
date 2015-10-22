module.exports = function(grunt) {

        grunt.initConfig({
                jshint: {
                    files: ['Gruntfile.js', 'size.js'],
                    options: {
                        globals: {
                            jQuery: true
                        }
                    }
                },
                coffee: {
                    compile: {
                        files: {
                            'size.js': 'coffee/size.coffee',
                            'content.js': 'coffee/content.coffee'
                        }
                    }
                },
                    sass: {
                        dist: {
                            files: {
                                'style.css': 'scss/style.scss'
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

            grunt.loadNpmTasks('grunt-contrib-jshint'); grunt.loadNpmTasks('grunt-contrib-watch'); grunt.loadNpmTasks('grunt-contrib-sass'); grunt.loadNpmTasks('grunt-contrib-coffee'); grunt.registerTask('default', ['jshint']); grunt.registerTask('default', ['sass']);

        };
