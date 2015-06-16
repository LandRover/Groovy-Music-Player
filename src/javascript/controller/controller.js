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
    var Controller = function(config, container) {
        this.init(config, container);
    };
    
    Controller.prototype = {
        /**
         * Main model referance
         */
        _model: null,
        
        
        /**
         * Constructor function for the main controller
         *
         * Registering important instances to hold here
         */
        init: function(config, container) {
            Logger.debug('CONTROLLER::INIT FIRED');
            
            this._model = new Model(config, container);
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