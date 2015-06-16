define([
    "../core",
    "../controller/controller",
    "../utils/logger",
    "../bind/jquery", // bind object to the global scope - as a plugin.
], function(gPlayer, Controller, Logger) {
    /**
     * Init is responsible for the object creation process.
     *
     * Starts the flow for all the other components
     */
    $.extend(true, gPlayer.prototype, {
        _controller: null,
        
        /**
         * Create method is the constructor method, called from the gPlayer object on invoke.
         * Returning a new of create.
         * 
         * One import note is the create is actually is the function that is new`ed
         * into an object.
         * 
         * @param {object} options, overrides the default options
         * @return {object}
         */
        create: function(options) {
            Logger.debug('CORE::INIT::CREATE FIRED');
            
            this._controller = new Controller(options);
            
            return this;
        },
        
        
        /**
         * Start executes the flow.
         */
        bootstrap: function() {
            Logger.debug('CORE::INIT::BOOTSTRAP FIRED');
            
            this._controller.bootstrap(this.getEl());
            
            return this;
        }
    });
    
    gPlayer.prototype.create.prototype = gPlayer.prototype;
    
    return gPlayer.prototype.create;
});