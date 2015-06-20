define([
    "../utils/logger"
], function(Logger) {
    /**
     * Base View, all views inherit this shared and basic logic.
     *
     * Provides basic render and appenders for the view.
     */
    var ViewModel = {
        render: function() {
            Logger.debug('BASEVIEW::RENDER FIRED');
        }
    };
    
    return ViewModel;
});