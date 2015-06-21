define([
    "./base_view",
    "../utils/logger",
    "html/layout/gplayer.html",
], function(BaseView, Logger, gPlayerHTML) {
    /**
     * HTML structure of the droppable/sortable zone. Contains also the placeholder for the
     * mediaplayer which can be triggered and controlling the widget.
     */
    var gPlayerView = function(view) {
        Logger.debug('GPLAYER::CONSTRUCTOR FIRED');
        
        this._view = view;
        
        this.init();
    };
    
    gPlayerView.prototype = _.extend(new BaseView(), {
        _view: null,
        
        /**
         * Constructor, actually generates the output from a template;
         */
        init: function() {
            this.output = _.template(gPlayerHTML)(
                this._view.getModel().classes
            );
        }
        
        
    });
    
    return gPlayerView;
});