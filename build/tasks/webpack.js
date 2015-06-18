module.exports = function(grunt, options) {
    var webpack = require('webpack');
    
    return {
        /**
         *
         */
        options: {
            resolve: {
                modulesDirectories: [
                    'src/javascript/',
                    'src'
                ]
            },
            
            devtool: 'cheap-source-map',
            
            stats: {
                timings: true
            },
            
            module: {
                loaders: [
                
                ]
            }
        },
        
        
        /**
         *
         */
        debug : {
            options: {
                entry: {
                    gplayer: './src/javascript/gplayer.js'
                },
                
                output: {
                    path: 'dist/debug/',
                    filename: 'gplayer.js',
                    library: 'gplayer',
                    libraryTarget: 'umd',
                    pathinfo: true
                },
                
                plugins: [
                    new webpack.DefinePlugin({
                        __DEBUG__: true
                    })
                ]
            }
        },
        
        
        /**
         *
         */
        release : {
            options: {
                entry: {
                    gplayer: './src/javascript/gplayer.js'
                },
                
                output: {
                    path: 'dist/release/',
                    filename: 'gplayer.js',
                    library: 'gplayer',
                    libraryTarget: 'umd'
                },
                
                plugins: [
                    new webpack.DefinePlugin({
                        __DEBUG__: false
                    }),
                    
                    new webpack.optimize.UglifyJsPlugin()
                ]
            }
        }
    };
};