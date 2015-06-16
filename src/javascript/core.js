define([
    "./utils/event",
    "./core/api",
    "./utils/logger",
], function(Event, API, Logger) {
    var version = "@VERSION",
        gPlayer;

    /**
     * gPlayer main object
     *
     * When called running the create method from the Core.init object.
     */
    gPlayer = function(options) {
        Logger.debug('CORE::INIT FIRED');
        return new gPlayer.prototype.create(options);
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
        }
    };
    
    return gPlayer;
});