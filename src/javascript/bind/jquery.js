define([
    "../core"
], function(init) {

    /**
     * gPlayer: jQuery plugin register
     */
    $.fn.gPlayer = function (options) {
        // Helper strings to quickly perform functions on the draggable queue object.
        var args = Array.prototype.slice.call(arguments).slice(1), //Convert it to a real Array object.
            obj = null; 
        
        if ('undefined' === typeof($.gPlayerInstance)) {
            $.gPlayerInstance = new PlaylistQueue(options || {});
            $.gPlayerInstance.setEl(this).bootstrap();
            
        }
        
        if ('object' !== typeof(options)) {
            $.gPlayerInstance.verifyInstance(this);
            
            if ('undefined' !== typeof(options)) {
                obj = $.gPlayerInstance[options].apply(this, args);
            }
            
            return obj;
        }
    };
});