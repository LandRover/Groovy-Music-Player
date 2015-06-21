define([
    "./base_view",
    "../utils/logger",
    "html/layout/markup.html",
], function(BaseView, Logger, markupHTML) {
    /**
    * HTML structure of the droppable/sortable zone. Contains also the placeholder for the
    * mediaplayer which can be triggered and controlling the widget.
    *
    * @return {string} HTML
     */
    var Markup = function() {
        Logger.debug('MARKUP::CONSTRUCTOR FIRED');
    };
    
    Markup.prototype = _.extend(BaseView.prototype, {
        /**
         * not sure i like it :/
         */
        render: function(ids) {
            this.output = _.template(markupHTML)(ids);
            
            return this;
        }
    });
    
    return Markup;
});