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
        
        error: function(id, title, error, skin) {
            return _.template(errorHTML, {
                id: id,
                title: title,
                error: error,
                skin: skin
            })
        },
        
        render: function(id, title, error, skin) {
            this.output = this.error(id, title, error, skin);
            
            return this;
        }
    });
    
    return Error;
});