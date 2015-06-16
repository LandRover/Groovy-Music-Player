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
    var Init = {
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
            this._controller.bootstrap();
            
            return this;
        }
    };
    
    // bind back to create proto, jquery style of invoker
    Init.create.prototype = gPlayer.prototype = $.extend(true,
        gPlayer.prototype,
        Init
    );
    
    return gPlayer.prototype.create;
});