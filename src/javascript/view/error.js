define([
    "hbs!html/layout/error.html",
], function(errorHTML) {
    /**
     * Error template
     *
     * @param {Number} id
     * @param {String} title
     * @param {String} error
     * @param {String} skin
     */
    var Error = function(id, title, error, skin) {
        return errorHTML({
            id: id,
            title: title,
            error: error,
            skin: skin
        });
    };
    
    return Error;
});