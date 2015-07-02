define([
    "core",
    "core/api"
], function(gPlayer, API) {
    /**
     * gPlayer: jQuery plugin register
     * Is also a private member and can NOT be accessed externally. The only gateway is via API object.
     *
     * @return {Object} API
     */
    jQuery.fn.gPlayer = function (options) {
        var args = Array.prototype.slice.call(arguments).slice(1);  //Convert it to a real Array object.
        
        /**
         * Create is creating a singleton instance of gPlayer, setting the parent container as well as bootstraps the rendering
         * Used only when jQuery jQuery bind is needed.
         * 
         * @param {HTMLElement} container
         */
        var create = (function(container) {
            // return if instance already exists
            if ('undefined' !== typeof(jQuery.gPlayerInstance)) return;
            
            var instance = new gPlayer(options || {})
                .setEl(container)
                .bootstrap();
            
            // @todo Change position, instance should be stored in a local scope rather than in jquert scope to have multiple instances
            jQuery.gPlayerInstance = instance;
        })(this);
        
        return API;
    };
});