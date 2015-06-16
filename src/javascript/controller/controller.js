define([
    "../core",
    "../model/model",
    "../events/states",
    "../utils/logger",
], function(gPlayer, Model, States, Logger) {
    /**
     * gPlayer main controller
     *
     * Responsible for the general flow and creation of the view and models
     */
    var Controller = function(config) {
        this.init(config);
    };
    
    Controller.prototype = {
        _model: null,
        
        init: function(config) {
            Logger.debug('CONTROLLER::INIT FIRED');
            
            this._model = new Model(config);
        },
        
        
        /**
         * Bootstraps the main controller
         */
        bootstrap: function(config) {
            this._model.setup(config);
        }
    };
    
    return Controller;
});