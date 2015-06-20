define([
    "./base_view",
    "html/layout/error.html"
], function(BaseView, errorHTML) {
    /**
     * Error template
     *
     * @param {Number} id
     * @param {String} title
     * @param {String} error
     * @param {String} skin
     */
    var Error = _.extend(BaseView, {
        
        render: function(id, title, error, skin) {
            this.output = _.template(errorHTML)({
                errID: id,
                title: title,
                error: error,
                skin: skin
            });

            return this;
        },
        

    });
    
    return Error;
});