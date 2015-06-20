define([
    "./base_view",
    "html/layout/markup.html"
], function(BaseView, markupHTML) {
    /**
    * HTML structure of the droppable/sortable zone. Contains also the placeholder for the
    * mediaplayer which can be triggered and controlling the widget.
    *
    * @return {string} HTML
     */
    var Markup = _.extend(BaseView, {
        /**
         * not sure i like it :/
         */
        render: function() {
            this.output = _.template(markupHTML)();
            
            return this;
        }
    });
    
    return Markup;
});