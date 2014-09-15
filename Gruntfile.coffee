Path = require 'path'
module.exports = (grunt)->
    require('grunt-recurse')(grunt, __dirname)

    grunt.expandFileArg = (
        prefix = '.',
        base = '**',
        postfix = 'test.coffee'
    )->
        part = (v)->"#{prefix}/#{v}#{postfix}"
        files = grunt.option('files')
        return part(base) unless files
        files.split(',').map (v)-> part(v)

    # grunt-recurse magic.
    [
        ['.', 'src', 'client']
        ['.', 'src', 'style']
    ]
    .map((dir)->Path.join.apply null, dir)
    .map(grunt.grunt)

    console.log 'asdasd'

    grunt.Config =
        coffeelint:
            options:
                grunt.file.readJSON '.coffeelintrc'
            files: [
                'src/**/*.coffee'
                'Gruntfile.coffee'
            ]

        jshint:
            options:
                jshintrc: '.jshintrc'
            files:
                'src/**/*.js'

        clean:
            all:
                [ 'build/' ]

    grunt.registerTask 'test',
        'Run all non-component tests.',
        [ 'features' ]
    grunt.registerTask 'build',
        'Prepare distributable components.',
        [ 'client' ]

    grunt.registerTask 'linting',
        'Lint all files.',
        [ 'jshint', 'coffeelint' ]
    grunt.registerTask 'base',
        'Perform component specific prep and test steps.',
        [ 'clean:all', 'linting', 'build', 'style' ]
    grunt.registerTask 'default',
        'Perform all Prepare and Test tasks.',
        [ 'base' ]


    grunt.finalize()
