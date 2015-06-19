module.exports = function(grunt, options) {
    var webpack = require('webpack'),
        __node_dir = options.build.dir.lib.node,
        __bower_dir = options.build.dir.lib.bower;

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
                    jQuery: __bower_dir + '/jquery/dist/jquery.min.js',
                    hbs: __bower_dir + '/handlebars/handlebars.runtime.amd.min.js'
                }
            },
            
            module: {
                loaders: [
                
                ]
            },
            
            progress: true,
            
            amd: {
                jQuery: true
            },
            
            externals: {
                jQuery: 'jQuery'
            }
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
                    $: "jQuery",
                    jQuery: "jQuery",
                    "window.jQuery": "jQuery"
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
                })
                
                //new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
                //new webpack.optimize.DedupePlugin(),
                //new webpack.optimize.UglifyJsPlugin({ sourceMap: false }),
                //new webpack.optimize.OccurenceOrderPlugin()
                //new webpack.optimize.AggressiveMergingPlugin()
            ]
        }
    };
};