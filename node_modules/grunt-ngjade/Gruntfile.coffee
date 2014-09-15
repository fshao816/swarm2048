module.exports = (grunt)->
    grunt.initConfig
        ngjade:
            smoke:
                files: [{
                    expand: false
                    src: ['test/fixtures/*.jade']
                    dest: 'test/fixtures/templates.js'
                }]

     grunt.loadTasks './tasks'

     grunt.registerTask 'verifySmoke', ->
        template = grunt.file.read 'test/fixtures/templates.js'
        fixture = grunt.file.read 'test/fixtures/fixture.js'
        if -1 is template.indexOf fixture
            grunt.fail.fatal 'Compiled content does not match.'

     grunt.registerTask 'default', [ 'ngjade:smoke', 'verifySmoke' ]
