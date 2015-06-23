define([
    "../core",
    "../utils/logger",
], function(gPlayer, Logger) {
    /**
     * Public access point for object internals. The only exposed API.
     *
     * Subscribe to events and change internal settings via these methods.
     */
    var API = {
        /**
         * API to On event subscribe method.
         * Allows to subscribe with a specific behaviour trigger action.
         *
         * @param {String} event
         * @param {Mixed} data
         * @return this
         */
        on: function(event, data) {
            Logger.debug('ON FIRED!');
            
            return this;
        },
        
        
        /**
         * Begins playing.. Nyan Catttttttttttttttttttt
         *
         * @return this
         */
        play: function() {
            Logger.debug('PLAY FIRED!');
            
            return this;
        },
        
        
        
        /**
         * Pauses playing
         *
         * @return this
         */
        pause: function() {
            Logger.debug('PAUSE FIRED!');
            
            return this;
        },
        
        
        /**
         * Stops playing
         *
         * @return this
         */
        stop: function() {
            Logger.debug('STOP FIRED!');
            
            return this;
        },
        
        
        /**
         * Remove player and clean scope
         *
         * @return this
         */
        remove: function() {
            Logger.debug('REMOVE FIRED!');
            
            return this;
        },
        
        
        /**
         * Add item to the queue.
         */
        addItem: function(items) {
            Logger.debug('ADDITEM FIRED!');
            var queue = gPlayer().getController().getQueue();
            
            queue.add(items);
            
            return this;
        }
    };
    
    return API;
});