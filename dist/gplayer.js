/*!
 * gPlayer Library vundefined
 *
 * Date: 2015-06-03T05:15Z
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

    var
        version = "undefined",
        gPlayer,
        options = {};

    console.log('LOAD CORE 01');
    
    gPlayer = function(options) {
        console.log('GPLAYER FUNC 02');
        return new gPlayer.prototype.create(options);
    };
    
    gPlayer.prototype = {
        version: version,
        
        constructor: gPlayer
    };
    
    console.log('END CORE LOADED 001');
    console.log(gPlayer.prototype);

    /**
     * Basic Logger
     * 
     * Centralized access for the console.log method.
     * Wrapps around few method of Console to allow clean and unified API to log errors.
     *
     * @todo Consider XHR calls to log errors on server.
     * @todo Hook to the debug mode, controlled via configuration of the object.
     */
    var Logger = {
        /**
         * Fatal errors. Mission critial - application can not run when present.
         * @param {mixed} log
         */
        error: function(log) {
            return this._log('error', log);
        },
        
        
        /**
         * Warnning only. Should be fixed but application been able to recover.
         * @param {mixed} log
         */
        warn: function(log) {
            return this._log('warn', log);
        },
        
        
        /**
         * Information only. General info printed.
         * @param {mixed} log
         */
        info: function(log) {
            return this._log('info', log);
        },
        
        
        /**
         * Debug mode. Print as much as possible to allow quick and easy
         * debugging when needed.
         */
        debug: function(log) {
            return this._log('debug', log);
        },
        
        
        /**
         * Private method, provides single point of access to the console.log API.
         * prevents mess around the code and a clean way to prevent the output of the log
         * or the sevirity level.
         *
         * @param {string} sevirity
         * @param mixed log
         * @todo consider stacking the log calls, not so important but might be useful for debugging
         * @todo display on debug mode only - currently the whole mode is debug.
         */
        _log: function(sevirity, log) {
            return console[sevirity]([sevirity, log]);
        }
    };


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

    
    var Player = function() {
       this.init();
    };
    
    Player.prototype = {
        init: function() {
            Logger.debug('Player constructor fired.');
        }
    };

    
    // Register as a named AMD module, since gPlayer can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase gPlayer is used because AMD module names are
    // derived from file names, and gPlayer is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of gPlayer, it will work.
    
    // Note that for maximum portability, libraries that are not gPlayer should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. gPlayer is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
    
    if (typeof define === "function" && define.amd) {
        define("gPlayer", [], function() {
            return gPlayer;
        });
    }



    // Map over gPlayer in case of overwrite
    /* define window first..
    var _gPlayer = window.gPlayer;
    */
    
    gPlayer.noConflict = function(deep) {
        if (deep && window.gPlayer === gPlayer) {
           window.gPlayer = _gPlayer;
        }
    
        return gPlayer;
    };
    
    
    // Expose gPlayer even in AMD
    //if (!noGlobal) {
        //window.gPlayer = gPlayer;
    //}
    
    return gPlayer;
}));