module.exports = (grunt)->
    flatten = (a, b)-> a.concat b

    order = [
        'src/style/0_reset/**'
        'src/style/1_base/**'
    ].reduce(flatten, [])
    .map (n)-> "#{n}/*.styl"

    grunt.Config =
        watch:
            style:
                files: [
                    'src/client/**/*.styl'
                ]
                tasks: [
                    'buildClient'
                ]
                options:
                    spawn: false

        copy:
            style:
                files: [
                    expand: true
                    cwd: 'build/client'
                    src: ['assets/**/*']
                    dest: 'lib'
                ]


        stylus:
            options:
                paths: [
                    'src/style/definitions'
                ]
                import: [
                    'variables'
                ]
            all:
                files:
                    'build/client/assets/style.css': order

    grunt.registerTask 'style',
        'Compile static stylesheet.',
        [
            'stylus:all'
            'copy:style'
        ]
