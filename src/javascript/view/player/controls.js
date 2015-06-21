define([
    "../base_view",
    "../../utils/logger",
    "html/layout/markup.html",
], function(BaseView, Logger, markupHTML) {
    /**
    * 
    *
     */
    var Controls = function(view) {
        Logger.debug('MARKUP::CONSTRUCTOR FIRED');
        
        this._view = view;
        
        this.init();
    };
    
    Controls.prototype = _.extend(BaseView.prototype, {
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
    
    return Markup;
});