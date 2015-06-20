define([
    "./base_view",
    "html/error.html"
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
        /**
         * not sure i like it :/
         */
        render: function(id, title, error, skin) {
            this.output = _.template(errorHTML)({
                errID: id,
                title: title,
                error: error,
                skin: skin
            });
            
            return this;
        }
    });
    
    return Error;
});