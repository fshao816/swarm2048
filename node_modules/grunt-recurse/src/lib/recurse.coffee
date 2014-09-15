Path = require 'path'

module.exports = (grunt, root)->
    # Export the current package.json
    grunt.pkg = grunt.file.readJSON('package.json')

    grunt.grunt = (path)->
        other = require Path.join root, path, 'Gruntfile'
        other(grunt)

    Object.defineProperty grunt, 'Config', do->
        _config = {}
        get: -> _config
        set: (val)->
            for t, c of val
                _config[t] = _config[t] || {}
                for k, v of c
                    _config[t][k] = v
            grunt

    Object.defineProperty grunt, 'NpmTasks', do->
        _tasks = []
        get: -> _tasks
        set: (val)->
            _tasks = _tasks.concat val

    grunt.finalize = ->
        # After all the subGrunts have been loaded, finalize the config info.
        grunt.initConfig grunt.Config

        # Load all the requested tasks from NPM, as well as all installed
        # grunt-* installed modules.
        pattern = ['grunt-*', '!grunt-recurse']
        require('load-grunt-tasks')(grunt, {pattern})
        grunt.loadNpmTasks task for task in grunt.NpmTasks
