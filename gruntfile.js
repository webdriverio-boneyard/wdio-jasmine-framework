module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['build'],
        babel: {
            options: {
                sourceMap: false,
                optional: ['runtime']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['**/*'],
                    dest: 'build',
                    ext: '.js'
                }]
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['test/*.js'],
                root: './lib',
                options: {
                    reporter: 'spec',
                    require: [
                        'should',
                        './test/bootstrap'
                    ]
                }
            }
        },
        eslint: {
            options: {
                parser: 'babel-eslint'
            },
            target: ['lib/adapter.js']
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        },
        watch: {
            dist: {
                files: './lib/**/*.js',
                tasks: ['babel:dist']
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['eslint', 'mochaTest'])
    grunt.registerTask('build', 'Build wdio-jasmine-framework', function () {
        grunt.task.run([
            'default',
            'clean',
            'babel'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
}
