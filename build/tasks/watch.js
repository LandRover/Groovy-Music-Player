module.exports = function(grunt, options) {
    return {
    // watch js files and run jshint
    
    scripts: {
        files: [
            'src/javascript'
        ],
        tasks: ['build'],
        options: {
            spawn: false
        }
    }
    };
};