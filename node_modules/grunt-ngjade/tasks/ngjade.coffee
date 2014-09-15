module.exports = (grunt)->
    # content conversion for templates
    # by default, identity
    defaultProcessContent = (content) -> content
    # filename conversion for templates
    # by default, strip jade.
    defaultProcessName = (name)-> name.replace('.jade', '')

    # Normalize backslashes and strip newlines.
    escapeContent = (content)->
        content
        .replace(/\\/g, '\\\\').replace(/'/g, '\\\'')
        .replace(/\r?\n/g, '\\n\' +\n    \'')

    # Wrap content in a $templateCache block.
    template = (module, template, content)->
        "angular.module('#{module}').run(function($templateCache) {\n" +
        "  $templateCache.put('#{template}',\n    '#{content}'\n  );\n" +
        "});\n"

    # Filter function the check for existence of a file, and warn if not found.
    fileExists = (filepath)->
        # Warn on and remove invalid source files.
        if not grunt.file.exists(filepath)
            grunt.log.warn "Source file #{filepath} not found."
            false
        else
            true

    # Compile a src file through jade, passing in the options data
    compile = (src, options)->
        try
            compiled = require("jade").render(src, options)
            compiled = escapeContent(compiled)
            compiled = template options.moduleName, options.filename, compiled
            compiled
        catch e
            grunt.log.error e
            grunt.fail.warn "Jade failed to compile #{filepath}."

    # Read a file from the filesystem and compile it.
    prepare = (options) -> (filepath)->
        src = options.processContent(grunt.file.read(filepath))
        filename = options.processName(filepath)
        options = grunt.util._.extend options, {filename}

        compile src, options

    # Concat a list of strings and write to a file.
    write = (templates, file, options)->
        if templates.length < 1
            err = "Destination not written because compiled files were empty."
            grunt.log.warn err
        else
            grunt.file.write file.dest,
                templates.join grunt.util.normalizelf options.separator
            grunt.log.writeln "File \"#{file.dest}\" created."

    grunt.registerMultiTask 'ngjade',
        'Compile jade templates to ng.$tempateCache', ->

            options = @options
                moduleName: 'ng-templates'
                separator: grunt.util.linefeed + grunt.util.linefeed
                processContent: defaultProcessContent
                processName: defaultProcessName

            grunt.verbose.writeflags options, 'Options'

            @files.forEach (f)->
                templates = f.src
                .filter(fileExists)
                .map(prepare(options))

                write templates, f, options

