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
        
        console.log('BIND/JQUERY - INIT 501');
        console.log(jQuery.gPlayerInstance);
        console.log(gPlayer);
        
        
        // bind instance if none found
        var create = (function() {
            // return if instance already exists
            if ('undefined' !== typeof(jQuery.gPlayerInstance)) return;

            jQuery.gPlayerInstance = new gPlayer(options || {}).setEl(this);
            jQuery.gPlayerInstance.bootstrap();
        })();
        
        // object is passed only during the instance creation with options.. so anything else is a direct invoke.
        var invoke = (function(method) {
            if ('string' !== typeof(method)) return;
            
            console.log(['CALL', method, API]);
            
            //change condition.. not needed any more, run if method exists.
            if ('string' === typeof(method)) {
                console.log('BIND/JQUERY - METHOD FOUND, CALL IT 906');
                obj = API.entry.apply(this, args);
            }
            
            console.log('BIND/JQUERY - DONE 907');
            console.log(obj);
            console.log(API);
            
            return obj;
        })(options);
    };
});