define([
    "../core",
    "../utils/logger"
], function(gPlayer, Logger) {
    console.log('CORE/API LOADED 05');
    
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
            console.log('ON FIRED!');
            
            return this;
        },
        
        
        /**
         * Begins playing.. wooohoo
         *
         * @return this
         */
        play: function() {
            console.log('PLAY FIRED!');
            
            return this;
        },
        
        
        
        /**
         * Pauses playing
         *
         * @return this
         */
        pause: function() {
            console.log('PAUSE FIRED!');
            
            return this;
        },
        
        
        /**
         * Stops playing
         *
         * @return this
         */
        stop: function() {
            console.log('STOP FIRED!');
            
            return this;
        }
    };
    
    return API;
});