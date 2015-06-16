define([
    "../core",
    "../model/model",
    "../events/states",
], function(gPlayer, Model, States) {
    
    /**
     * gPlayer main controller
     *
     * Responsible for the general flow and creation of the view and models
     */
    var Controller = function(container) {
        this.init(container);
    };
    
    Controller.prototype = {
        _model: null,
        
        init: function(container) {
            console.log('CONTROLLER::INIT FIRED');
            
            this._model = new Model();
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