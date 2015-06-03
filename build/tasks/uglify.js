module.exports = function(grunt, options) {
    return {
    all: {
        files: {
            "dist/gplayer.min.js": ["dis/gplayer.js"]
        },
        options: {
            preserveComments: false,
            sourceMap: true,
            sourceMapName: "dist/gplayer.min.map",
            report: "min",
            beautify: {
                "ascii_only": true
            },
            banner: "hi",
            compress: {
                "hoist_funs": false,
                loops: false,
                unused: false
            }
        }
    }
    };
};