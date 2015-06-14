define([
    "../core",
    "../core/api"
], function(gPlayer, API) {

    /**
     * gPlayer: jQuery plugin register
     */
    jQuery.fn.gPlayer = function (options) {
        // Helper strings to quickly perform functions on the draggable queue object.
        var args = Array.prototype.slice.call(arguments).slice(1), //Convert it to a real Array object.
            obj = null; 
        
        // bind instance if none found
        var create = (function() {
            // return if instance already exists
            if ('undefined' !== typeof(jQuery.gPlayerInstance)) return;
            
            console.log('BIND/JQUERY - INIT 501');
            console.log(jQuery.gPlayerInstance);
            console.log(gPlayer);
        
            var instance = new gPlayer(options || {})
                .setEl(this)
                .bootstrap();
            
            // @todo Change position, instance should be stored in a local scope rather than in jquert scope to have multiple instances
            jQuery.gPlayerInstance = instance;
        })();
        
        return API;
    };
});