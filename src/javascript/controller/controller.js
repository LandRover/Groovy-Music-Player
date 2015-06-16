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
        /**
         * Main model referance
         */
        _model: null,
        
        
        /**
         * Constructor function for the main controller
         *
         * Registering important instances to hold here
         *
         * @param {Object} config
         * @param {Object}
         * @return this for chaining
         */
        init: function(config) {
            Logger.debug('CONTROLLER::INIT FIRED');
            
            this._model = new Model(config);
            
            return this;
        },
        
        
        /**
         * Bootstraps the main controller
         */
        bootstrap: function(container) {
            this._model.setup(container);
        }
    };
    
    return Controller;
});