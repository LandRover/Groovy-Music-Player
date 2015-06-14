define([
    "./utils/event",
    "./core/api"
], function(Event, API) {
    var version = "@VERSION",
        gPlayer;

    console.log('LOAD CORE 01');
    
    gPlayer = function(options) {
        console.log('GPLAYER FUNC 02');
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
         * @return {object} gPlayer instance
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
    
    console.log('END CORE LOADED 001');
    console.log(gPlayer.prototype);
    
    return gPlayer;
});