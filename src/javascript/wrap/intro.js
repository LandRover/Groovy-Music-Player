/*!
 * gPlayer Library v@VERSION
 *
 * Date: @DATE
 */

(function(global, factory) {
    // CommonJS/Node and CommonJS-like environments
    if ('object' === typeof(module) && 'object' === typeof(module.exports)) {
        factory(['jQuery']); // require jQuery
        //factory(['Zepto']); // require Zepto
    } else
    
    // AMD - Anonymous module assign
    if (define.amd && 'function' === typeof(define)) {
        define(['jQuery'], factory); // require jQuery
        //define(['Zepto'], factory); // require Zepto
    }
    
    // Regular web usage
    else {
        // Pass the proper lib to the factory
        if (global.jQuery) {
            factory(global.jQuery);
        } else
        if (global.Zepto) {
            factory(global.Zepto);
        } else {
            console.error('Failed to find jQuery/Zepto, one of this is mandatory for the application to run.');
        }
    }

// Pass this if window is not defined
}('undefined' !== typeof(window) ? window : this, function($, undefined) {
