define([
    "../core",
    "../core/api"
], function(gPlayer, API) {
    /**
     * gPlayer: jQuery plugin register
     */
    jQuery.fn.gPlayer = function (options) {
        var args = Array.prototype.slice.call(arguments).slice(1); //Convert it to a real Array object.
        
        // bind instance if none found
        var create = (function() {
            // return if instance already exists
            if ('undefined' !== typeof(jQuery.gPlayerInstance)) return;
            
            var instance = new gPlayer(options || {})
                .setEl(this)
                .bootstrap();
            
            // @todo Change position, instance should be stored in a local scope rather than in jquert scope to have multiple instances
            jQuery.gPlayerInstance = instance;
        })();
        
        return API;
    };
});