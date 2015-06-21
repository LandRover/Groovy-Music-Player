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
    var Player = function(view) {
        Logger.debug('MARKUP::CONSTRUCTOR FIRED');
        
        this._view = view;
        
        this.init();
    };
    
    Player.prototype = _.extend(BaseView.prototype, {
        _view: null,
        
        /**
         * Constructor, actually generates the output from a template;
         */
        init: function() {
            this.output = _.template(markupHTML)(
                this._view.getModel().classes
            );
        }
        
        
    });
    
    return Player;
});