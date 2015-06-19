module.exports = function(grunt, options) {
    var webpack = require('webpack'),
        __bower_dir = __dirname + '/../../bower_components',
        __node_dir = __dirname + '/../../node_modules';

    return {
        options: {
            debug: true,
            resolve: {
                modulesDirectories: [
                    options.build.src,
                    options.build.src + '/..'
                ]
            },
            
            devtool: 'cheap-source-map',
            
            stats: {
                timings: true,
                color: true,
                reasons: true
            },
            
            resolve: {
                alias: {
                    'jquery': __bower_dir + '/jquery/dist/jquery.min.js'
                }
            },
            
            module: {
                loaders: [
                
                ]
            },
            
            progress: true
        },
        
        
        /**
         *
         */
        debug: {
            debug: true,
            
            entry: {
                gplayer: options.build.src + '/gplayer.js'
            },
            
            output: {
                path: options.build.dir.debug,
                filename: 'gplayer.js',
                library: 'gplayer',
                libraryTarget: 'umd',
                pathinfo: true
            },
            
            plugins: [
                new webpack.DefinePlugin({
                    __DEBUG__: true
                }),
                
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jquery: "jquery",
                    "window.jQuery": "jquery"
                })
            ]
        },
        
        
        /**
         *
         */
        release: {
            entry: {
                gplayer: options.build.src + '/gplayer.js'
            },
            
            output: {
                path: options.build.dir.release,
                filename: 'gplayer.js',
                library: 'gplayer',
                libraryTarget: 'umd',
                pathinfo: true
            },
                
            plugins: [
                new webpack.DefinePlugin({
                    __DEBUG__: true
                }),
                
                new webpack.optimize.UglifyJsPlugin()
            ]
        }
    };
};