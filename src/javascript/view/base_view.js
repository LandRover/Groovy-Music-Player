define([
    "../utils/logger"
], function(Logger) {
    /**
     * Base View, all views inherit this shared and basic logic.
     *
     * Provides basic render and appenders for the view.
     */
    var BaseView = function() {
        Logger.debug('BASEVIEW::CONSTRUCTOR FIRED');
    };
    
    
    BaseView.prototype = {
        output: '',
        
        
        /**
         *
         */
        append: function(to) {
            Logger.debug(['BASEVIEW::APPEND FIRED', to, this.output]);
            
            $(to).append(this.output);
            
            return this;
        }
    };
    
    return BaseView;
});