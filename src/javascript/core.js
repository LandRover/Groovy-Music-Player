define([
    "utils/event",
    "utils/logger",
], function(Event, Logger) {
    var version = "@VERSION",
        gPlayer;

    /**
     * gPlayer main object
     *
     * When called running the create method from the Core.init object.
     */
    gPlayer = function(options) {
        if (!arguments.callee._singletonInstance) {
            Logger.debug('CORE::INIT::CREATION OF SINGLETON GPLAYER!');
            
            arguments.callee._singletonInstance = new gPlayer.prototype.create(options); // jquery like creation method, nice idea
        }
        
        return arguments.callee._singletonInstance;
    };
    
    gPlayer.prototype = {
        /* active gplayer element on DOM */
        el: null,
        
        /* options object */
        options: {},
        
        /* gplayer version, set during build */
        version: version,
        
        /* constructor */
        constructor: gPlayer,
        
        
        /**
         * Set the active HTML element, gplayer will append the markup there.
         * 
         * @param {DOMElement} el
         * @return {Object} gPlayer instance
         */
        setEl: function(el) {
            this.el = el;
            
            return this;
        },
        
        
        /**
         * Get the active HTML elemnt gplayer is bound to
         * 
         * @return {DOMElement} referance
         */
        getEl: function() {
            return this.el;
        },
        
        
        /**
         * Get the controller instance, set during the init
         *
         * @return {Object} Controller
         */
        getController: function() {
            return this._controller;
        }
    };
    
    return gPlayer;
});