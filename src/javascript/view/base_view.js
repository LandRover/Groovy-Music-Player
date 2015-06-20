define([
    "../utils/logger"
], function(Logger) {
    /**
     * Base View, all views inherit this shared and basic logic.
     *
     * Provides basic render and appenders for the view.
     */
    var ViewModel = {
        output: '',
        
        
        /**
         *
         */
        append: function(to) {
            Logger.debug('BASEVIEW::APPEND FIRED', to);
            
            $(to).append(this.output);
            
            return this;
        }
    };
    
    return ViewModel;
});