define([
    "../core",
    "../utils/logger",
    "../bind/jquery", // bind object to the global scope - as a plugin.
], function(gPlayer, Logger) {
    
    console.log('CORE/INIT LOADED 05');
    
    gPlayer.prototype = $.extend(true, {}, gPlayer.prototype, {
        /**
         * Default options, can and will be overriden on invoke when params are passed.
         */
        options: {
            skin: 'orange',
            
            sortable: {
                distance: 30,
                tolerance: 'pointer',
                zIndex: 200
            }
        },
        
        
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
            Logger.info('gPlayer.prototype.create fired!');
            
            console.log('CORE/CREATE FIRED 06');
            
            this.options = $.extend(true, {},
                this.options
            );
            
            this.init();
            
            return this;
        },
        
        
        /**
         * Initiazlization method, adds event listeners, starting the player.
         * Also triggering the view rendering and the beginning of the whole process.
         */
        init: function() {
            // call ui?
            // figure out where to place it.
        }
    });

    // bind back to create proto
    gPlayer.prototype.create.prototype = gPlayer.prototype;
    
    return gPlayer.prototype.create;
});