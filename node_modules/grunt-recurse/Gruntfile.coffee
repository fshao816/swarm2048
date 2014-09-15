Path = require 'path'

module.exports = (grunt)->
    # Load grunt-recurse from the name given in package.json main,
    # to ensure it will work when it's a node module.
    module = './' + grunt.file.readJSON('package.json').main
    require(module)(grunt, __dirname)

    # Recursively load the configuration in src/test/Gruntfile.coffee
    grunt.grunt Path.join('src', 'test')

    # Finally, our project's root tasks.
    grunt.registerTask 'default', ['test']

    grunt.finalize()
