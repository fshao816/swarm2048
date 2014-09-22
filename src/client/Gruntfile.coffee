module.exports = (grunt)->
    flatten = (a, b)-> a.concat b

    appFileOrdering = [
        'src/client/**/module.coffee'
        'src/client/**/template.jade'
        'src/client/**/service.coffee'
        'src/client/**/controller.coffee'
        'src/client/**/directive.coffee'
    ].reduce flatten, []

    jadeTemplateId = (filepath)->
        filepath
        .replace /^src\/client\/(.*)\/template.jade$/, '$1'

    grunt.Config =
        watch:
            client:
                files: [
                    'src/client/**/*.js'
                    'src/client/**/*.coffee'
                    'src/client/**/*.jade'
                ]
                tasks: [
                    'buildClient'
                ]
                options:
                    spawn: false

        jade:
            index:
                files: {
                    'build/client/index.html': ['src/client/index.jade']
                }
        ngjade:
            templates:
                files: [{
                    expand: false
                    src: ['src/client/**/template.jade']
                    dest: 'build/client/templates.js'
                }]
                options:
                    moduleName: 'swarm-2048'
                    processName: jadeTemplateId

        copy:
            client:
                files: [
                    expand: true
                    cwd: 'src/client'
                    src: ['index.html', 'assets/**/*']
                    dest: 'build/client'
                ]
            css:
                files: [
                    expand: true
                    cwd: 'bower_components/nv-dermis/lib'
                    src: ['assets/**/*']
                    dest: 'build/client'
                ]
            sampleData:
                files: [
                    expand: true
                    cwd: 'src/client/components'
                    src: [
                        'chart/**/data.json'
                        'grid/**/data.json'
                        'heatmap/**/sampleData.json'
                        'nv-esoi/**/data.json'
                    ]
                    dest: 'build/client/sampleData'
                ]
            vendors:
                files: [
                    expand: true
                    cwd: 'bower_components'
                    src: [
                        'angular/angular.*'
                        'angular-animate/angular-animate.*'
                    ]
                    dest: 'build/client/vendors'
                ]

        concat:
            release:
                files:
                    'lib/swarm-2048.js': [
                        'build/client/swarm-2048.js'
                        'build/client/templates.js'
                    ].reduce(flatten, [])

        coffee:
            options:
                bare: false
            dist:
                files:
                    'build/client/app.js': appFileOrdering
                        .filter (file)-> file.match(/\.coffee$/)

    # butt === Browser Under Test Tools
    butt = unless process.env['DEBUG']
        if process.env['BAMBOO']
            ['PhantomJS']
        else
            ['Chrome']
    else
        []

    coverage = if process.env.DEBUG then 'coffee' else 'coverage'

    grunt.Config =
        karma:
            client:
                options:
                    browsers: ['Chrome']
                    frameworks: [ 'mocha', 'sinon-chai' ]
                    reporters: [ 'spec' ]
                    singleRun: true
                    preprocessors:
                        'src/client/**/module.coffee': ['coffee']
                        'src/client/**/service.coffee': ['coffee']
                        'src/client/**/controller.coffee': ['coffee']
                        'src/client/**/directive.coffee': ['coffee']
                        'src/client/**/*test.coffee': ['coffee']
                        'src/client/**/*.jade': ['ng-html2js']
                    files: [
                        'bower_components/angular/angular.js'
                        appFileOrdering
                        'src/client/**/test.coffee'
                    ]
                    # ngHtml2JsPreprocessor:
                    #     jade: true
                    #     moduleName: 'swarm-2048'
                    #     cacheIdFromPath: jadeTemplateId
                    # coverageReporter:
                    #     type: 'lcov'
                    #     dir: 'build/coverage/'

    grunt.registerTask 'testClient',
        'Run karma tests against the client.',
        [
            'karma:client'
        ]

    grunt.registerTask 'buildClient',
        'Prepare the build/ directory with static client files.',
        [
            'copy:client'
            'copy:vendors'
            'copy:css'
            'copy:sampleData'
            'ngjade:templates'
            'jade:index'
            'coffee:dist'
            'concat:release'
        ]

    grunt.registerTask 'client',
        'Prepare and test the client.',
        [
            'testClient'
            'buildClient'
        ]
