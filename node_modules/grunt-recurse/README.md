# grunt-recurse

Recursively load subproject Grunt files. Load all `grunt-*` modules saved in
`package.json`'s dependency lists. All you need to do is define config options
and register your own tasks.

## Basic Usage

In a Gruntfile in the root of your project, require `grunt-recurse` and tell it
to load subprojects. Register any default tasks and configurations. Finalize
the grunt configuration.

```javascript
// ./Gruntfile.js

module.exports = function(grunt){

    // Use grunt-recurse on the module. Pass the __dirname to ensure pathing.
    require('grunt-recurse')(grunt, __dirname);
    [
        './src/client',
        './src/server'
    ].each(function(subproject){
        grunt.grunt(subproject);
    });

    // Prepare any multiconfigs.
    grunt.Config = {
        jshint: {
            files: ['./src/**/*.js'],
            options: {
                jshintrc: './.jshintrc'
            }
        }
    };

    // Register tasks like normal.
    grunt.registerTask(
        'default', 
        'Perform full build and test of the entire project.'
        [ 'jshint', 'client', 'server' ]
    );

    // Call finalize to push grunt.Config into initConfg, and other things.
    grunt.finalize();
};
```

In the Gruntfiles of each subproject, assign config setting to `grunt.Config`.
File paths will still be relative to the root Gruntfile.

```javascript
// ./src/client/Gruntfile.js
module.exports = function(grunt){
    grunt.Config = {
        copy: {
            client: {
                files: [ {
                    expand: true,
                    src: ['./src/client/**'],
                    dest: './build/client'
                } ]
            }
        }
    };

    grunt.registerTask(
        'client',
        'Perform all tasks necessary to build the client.'
        ['copy:client']
    );
};
```

## Automagic

`grunt-recurse` uses `sindresorhus/load-grunt-tasks` to mitigate need for
`grunt.loadNpmTasks` or `grunt.NpmTasks = []`. `package.json` settings are
loaded into `grunt.pkg`.

## Conventions

There are no enforcements on task naming or configuration settings. Grunt will
apply whatever change got made last during the run. Thus, `grunt.registerTask`
with the same name in both the core Gruntfile and the submodule Gruntfile
will conflict, and (using the above code layout) the core Gruntfile's definition
will be used.

For this reason, I recommend the convention of each submodule Gruntfile
registering a task with the name of the submodule's folder, and namespacing
the registered tasks within the submodule as camel-case or hyphen-seperated
using the submodule's folder name. This is just a convention, and you are free
to use whatever mechanism necessary to ensure the tasks names do not collide.

The config object is merged at the task level. Using, eg, `grunt-contrib-copy`
across several modules, if each target is given a seperate name, they will live
harmoniously. Otherwise, the last defined target options will override any prior 
definitions.

## Changelog

### 0.2.1 on 2013-12-22
 - No longer warns that grunt-recurse isn't a loadable grunt task.

### 0.2.0 on 2013-11-17
 - `load-grunt-tasks` to load all npm tasks saved in package.json
 - Remove coffee-script dependency.
 - Automatically finalize Grunt configuration.
 - Updated documentation.

### 0.1.0 on 2013-10-29
 - `grunt.grunt` to load submodule grunt files.
 - `grunt.Config = {configobject}` to set task config properties.
