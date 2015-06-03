module.exports = function (grunt) {
    /*
    Install Grunt:
    -------------------
        npm install -g grunt-cli grunt-init
        npm init (reads existing package.json file)
    
    Install Grunt Prerequisites:
    ---------------------
        npm install
    
    Gem Prerequisites:
    -----------------
        gem install sass
        gem install compass
        gem install image_optim
    */
    
    // Print the execution time for the tasks
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: {
            pkg: grunt.file.readJSON('package.json'),

            build: {
                src: './src/javascript',
                dest: 'dist',
                banner: require('fs').readFileSync(__dirname + '/build/banner.txt', 'utf8')
            }
        },
    
    build: {
        all: {
            dest: "dist/gplayer.js"
        }
    },
    watch: {
        files: ['./src/**/*.js'],
        tasks: ['build']
    }
    });

    require("load-grunt-tasks")(grunt);

    // load grunt folder tasks.
    grunt.loadTasks('build/tasks');

    // Default task
    grunt.registerTask('default', [
        'jshint:src',
        'uglify'
    ]);
};