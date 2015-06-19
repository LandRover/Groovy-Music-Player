module.exports = function (grunt) {
    /*
    Install Grunt and other prerequisites:
    ---------------------
        npm install
    
    Gem Prerequisites:
    -----------------
        gem install sass
        gem install compass
        gem install image_optim
    */
    var path = require('path');
    var cwd = process.cwd();
    
    // Print the execution time for the tasks
    require('time-grunt')(grunt);
    
    // loads npm
    require('load-grunt-tasks')(grunt);
    
    require('load-grunt-config')(grunt, {
        configPath: path.join(cwd, '/build/tasks'),
        config: {
            pkg: grunt.file.readJSON('package.json'),
            
            build: {
                src: path.join(cwd, '/src/javascript'),
                
                dir: {
                    debug: path.join(cwd, '/dist/debug'),
                    release: path.join(cwd, '/dist/release'),
                    
                    lib: {
                        node: path.join(cwd, '/node_modules'),
                        bower: path.join(cwd, '/bower_components')
                    }
                },
                
                banner: require('fs').readFileSync(__dirname + '/build/banner.txt', 'utf8')
            }
        }
    });
        
    // load grunt folder tasks.
    grunt.loadTasks('build');

    // Default task
    grunt.registerTask('default', [
        'jshint:src',
        'uglify'
    ]);
};