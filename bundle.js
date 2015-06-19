/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(5),
	    __webpack_require__(16)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, Player) {
	    /* global __webpack_public_path__:true */
	    __webpack_require__.p = 'get current path here! @todo';
	    
	    console.log(gPlayer);
	    
	    return (window.gPlayer = gPlayer);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(2),
	    __webpack_require__(3),
	    __webpack_require__(4),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Event, API, Logger) {
	    var version = "@VERSION",
	        gPlayer;

	    /**
	     * gPlayer main object
	     *
	     * When called running the create method from the Core.init object.
	     */
	    gPlayer = function(options) {
	        Logger.debug('CORE::INIT FIRED');
	        
	        return new gPlayer.prototype.create(options); // jquery like creation method, nice idea
	    };
	    
	    gPlayer.prototype = {
	        /* active gplayer element on DOM */
	        el: null,
	        
	        /* options object */
	        options: {},
	        
	        /* gplayer version, set during build */
	        version: version,
	        
	        /* constructor */
	        constructor: gPlayer,
	        
	        
	        /**
	         * Set the active HTML element, gplayer will append the markup there.
	         * 
	         * @param {DOMElement} el
	         * @return {Object} gPlayer instance
	         */
	        setEl: function(el) {
	            this.el = el;
	            
	            return this;
	        },
	        
	        
	        /**
	         * Get the active HTML elemnt gplayer is bound to
	         * 
	         * @return {DOMElement} referance
	         */
	        getEl: function() {
	            return this.el;
	        }
	    };
	    
	    return gPlayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer) {
	    /**
	     * Event based module, publish / subscribe with herarchical events and notifiations.
	     * 
	     * Usage:
	     *   Event.on('test_one_event', function() {
	     *      console.log('test 1 event fired');
	     *      console.log(arguments);
	     *   });
	     *
	     *   Event.once('test_two_event', function() {
	     *      console.log('test 2 event fired, once.');
	     *      console.log(arguments);
	     *   });
	     *
	     *   var three = Event.on('test_three_event', function() {
	     *      console.log('test 3 event fired');
	     *   });
	     *
	     *   Event.fire('test_one_event', {eventID: 1}); // fires ok
	     *   Event.fire('test_two_event', {eventID: 2}); // fires ok
	     *   Event.fire('test_two_event', {eventID: 3}); // didnt trigger the event since it was unsubscribed (subscribed once only)
	     *   three.off(); // will remove the test_three_event
	     *   Event.fire('test_three_event', {eventID: 4}); // didnt trigger, was remove line above.
	     */
	    var Event = function() {};
	    
	    Event.prototype = {
	        _subscriptions: {},
	        
	        /**
	        * Attach a callback to an EventName
	        * 
	        * @param {string} name
	        * @param {function} callback
	        */
	        on: function(name, callback) {
	            if ('undefined' === typeof(this._subscriptions[name]))
	                this._subscriptions[name] = [];
	            
	            var index = this._subscriptions[name].push(callback) - 1,
	                self = this;
	            
	            // return back a clean remove function with the params encaspulated
	            return (function(name, callback) {
	                return {
	                    off: function() {
	                        return self.off(name, callback);
	                    }
	                };
	            })(name, callback);
	        },
	        
	        
	        /**
	        * Attach a callback to an name, but once only. Will disapear after first execution.
	        * 
	        * @param {string} name
	        * @param {function} callback
	        */
	        once: function(name, callback) {
	            var self = this,
	                onceCallback = function() {
	                    self.off(name, onceCallback);
	                    callback.apply(this, arguments);
	                };
	            
	            // preserve the original callback to allow subscribe once method to be removed later if needed.
	            onceCallback._originalCallback = callback;
	            
	            this.on(name, onceCallback);
	        },
	        
	        
	        /**
	        * Notify subscriptions by calling their name
	        * 
	        * @param {string} name
	        * @param {object} params
	        */
	        fire: function(name, params) {
	            var callbacks = this._subscriptions[name] || [];
	            
	            callbacks.forEach(function(callback) {
	                callback(params);
	            });
	        },
	        
	        
	        /**
	        * Remove a specific name callback from the stack
	        * 
	        * @param {string} name
	        * @param {function} callback
	        */
	        off: function(name, callback) {
	            var callbacks = this._subscriptions[name],
	                matchCallback = function(cb) {
	                    return (cb === callback || cb._originalCallback === callback)
	                };
	            
	            callbacks.forEach(function(eventCallback, i) {
	                if (matchCallback(eventCallback)) {
	                    callbacks.splice(i, 1);
	                }
	            });
	            
	            // if no callbacks left remove the event name from the tree completly.
	            if (0 === callbacks.length) {
	                delete this._subscriptions[name];
	            }
	        },
	        
	        
	        /**
	         * Removes all the subscriptions
	         */
	        removeAllSubscriptions: function() {
	            this._subscriptions = [];
	        },
	        
	        
	        /**
	         * Get all the active subscriptions tree
	         */
	        getAllSubscriptions: function() {
	            return this._subscriptions;
	        }
	    };
	    
	    return Event;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(4)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, Logger) {
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
	        }
	    };
	    
	    return API;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer) {
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
	            if ('undefined' !== typeof(console) && 'undefined' !== typeof(console[sevirity])) {
	                console[sevirity]([sevirity, log]);
	            }
	        }
	    };
	    
	    return Logger;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(4),
	    __webpack_require__(6),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, Logger) {
	    
	    var Player = function() {
	       this.init();
	    };
	    
	    Player.prototype = {
	        init: function() {
	            Logger.debug('Player constructor fired.');
	        }
	    };
	    
	    return Player;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(7),
	    __webpack_require__(4),
	    __webpack_require__(15), // bind object to the global scope - as a plugin.
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, Controller, Logger) {
	    /**
	     * Init is responsible for the object creation process.
	     *
	     * Starts the flow for all the other components
	     */
	    $.extend(true, gPlayer.prototype, {
	        _controller: null,
	        
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
	            Logger.debug('CORE::INIT::CREATE FIRED');
	            
	            this._controller = new Controller(options);
	            
	            return this;
	        },
	        
	        
	        /**
	         * Start executes the flow.
	         */
	        bootstrap: function() {
	            Logger.debug('CORE::INIT::BOOTSTRAP FIRED');
	            
	            this._controller.bootstrap(this.getEl());
	            
	            return this;
	        }
	    });
	    
	    gPlayer.prototype.create.prototype = gPlayer.prototype;
	    
	    return gPlayer.prototype.create;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(8),
	    __webpack_require__(13),
	    __webpack_require__(10),
	    __webpack_require__(12),
	    __webpack_require__(2),
	    __webpack_require__(4),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, Model, View, Events, States, Event, Logger) {
	    /**
	     * gPlayer main controller
	     *
	     * Responsible for the general flow and creation of the view and models
	     */
	    var Controller = function(config) {
	        this.init(config);
	    };
	    
	    Controller.prototype = {
	        /**
	         * Main model referance
	         */
	        _model: null,
	        
	        
	        /**
	         * Notifications referance
	         */
	        _notifications: null,
	        
	        
	        /**
	         * View referance
	         */
	        _view: null,
	        
	        
	        /**
	         * Constructor function for the main controller
	         *
	         * Registering important instances to hold here
	         *
	         * @param {Object} config
	         * @param {Object}
	         * @return this for chaining
	         */
	        init: function(config) {
	            Logger.debug('CONTROLLER::INIT FIRED');
	            
	            this._model = new Model(config);
	            this._notifications = new Event();
	            this._view = new View(this, this._model, this._notifications);
	            
	            return this;
	        },
	        
	        
	        /**
	         * Bootstraps the main controller
	         */
	        bootstrap: function(container) {
	            this._model.setup(container);
	            this._view.setup();
	        }
	    };
	    
	    return Controller;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(9),
	    __webpack_require__(11),
	    __webpack_require__(4),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, BaseModel, MediaModel, Logger) {
	    /**
	     * gPlayer Model
	     *
	     * Stores the current state of the player. Holds the playlist data the the current active media state.
	     */
	    var Model = function(config) {
	        this.init(config);
	    };
	    
	    Model.prototype = $.extend(true, {
	        /**
	         * Default config data
	         */
	        config: {
	            // controls
	            autoplay: false,
	            controls: true,
	            mute: false,
	            
	            // skin
	            skin: 'grooveshark',
	            
	            // features
	            crossfade: false,
	            waveform: false,
	            spectrum: false,
	            
	            // player settings
	            state: States.IDLE,
	            duration: -1,
	            position: 0,
	            volume: 100,
	            buffer: 0,
	            
	            // queue sorting properties
	            sortable: {
	                distance: 30,
	                tolerance: 'pointer',
	                zIndex: 200
	            },
	            
	            // collection
	            playlist: []
	        },
	        
	        
	        /**
	         * Current media model object, stores data for the current playing item.
	         */
	        _mediaModel: null,
	        
	        
	        /**
	         * Main gPlayer container object selector.
	         */
	        _container: null,
	        
	        
	        /**
	         * Constructor method, called when object is created.
	         *
	         * @param {Object} config
	         * @return this for chaining
	         */
	        init: function(config) {
	            Logger.debug('MODEL::INIT FIRED');
	            
	            // external config data merge with defaults
	            $.extend(true, this, this.config, config);
	            
	            this._mediaModel = new MediaModel();
	            
	            return this;
	        },
	        
	        
	        /**
	         * Sets up the main model
	         *
	         * @param {DOMElement} container
	         * @todo add merge with localStorage data to store user preferences locally
	         * @return this for chaining
	         */
	        setup: function(container) {
	            Logger.debug('MODEL::SETUP FIRED');
	            
	            this._container = container;
	            
	            return this;
	        }
	    }, new BaseModel);
	    
	    return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(2),
	    __webpack_require__(10),
	    __webpack_require__(4),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, Event, Events, Logger) {
	    /**
	     * Base Model, all models inherit this shared and basic logic.
	     *
	     * Provides basic setter and getter capability
	     * and on change broadcasts an event with the changes anyone can subscribe.
	     */
	    var BaseModel = function() {
	        Logger.debug('BASEMODEL::CONSTRUCTOR FIRED!');
	        $.extend(true, this, new Event);
	    };
	    
	    BaseModel.prototype = {
	        /**
	         * Getter for the model internals
	         *
	         * @param {String} key
	         * @param {Mixed} defaultValue - if nothing found, will return the default
	         * @return {Mixed} stored data or the default value is returned.
	         */
	        get: function(key, defaultValue) {
	            return ('undefined' !== typeof(this[key]) ? this[key] : defaultValue);
	        },
	        
	        
	        /**
	         * Setter for the model internals
	         *
	         * @param {String} key
	         * @param {Mixed} value
	         * @return this for easy chaining.
	         */
	        set: function(key, value) {
	            var oldValue = this[key];
	            
	            //check same value exists, prevents the event from firing since nothing changed.
	            if (value !== oldValue) {
	                this[key] = value;
	                this.on(Events.CHANGE + key, this, value, oldValue);
	            }
	            
	            return this;
	        }
	    };
	    
	    return BaseModel;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer) {
	    /**
	     * Events list
	     */
	    var Events = {
	        CHANGE: "CHANGE:",
	        PLAYER_READY: "PLAYER_READY"
	    };
	    
	    return Events;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(9),
	    __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, BaseModel, States) {
	    /**
	     * Media Model
	     */
	    var MediaModel = function() {
	    };
	    
	    MediaModel.prototype = $.extend(true, {
	        state: States.IDLE
	    }, new BaseModel);
	    
	    return MediaModel;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer) {
	    /**
	     * Player states list
	     */
	    var States = {
	        LOADING: "LOADING",
	        STALLED: "STALLED",
	        
	        BUFFERING : "BUFFERING",
	        IDLE: "IDLE",
	        COMPLETE: "COMPLETE",
	        PAUSED: "PAUSED",
	        PLAYING: "PLAYING",
	        CROSSFADING: "CROSSFADING",
	        ERROR: "ERROR"
	    };
	    
	    return States;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(10),
	    __webpack_require__(4),
	    __webpack_require__(14),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, Events, Logger, Error) {
	    /**
	     * View
	     */
	    var View = function(controller, model, notifications) {
	        this._model = model;
	        this._controller = controller;
	        this._notifications = notifications;
	        
	        this.init(); // init constructor
	    };
	    
	    View.prototype = {
	        _model: null,
	        _controller: null,
	        _notifications: null,
	        
	        
	        /**
	         * Constructor for the view.
	         *
	         * @return this for chaining
	         */
	        init: function() {
	            Logger.debug('VIEW::INIT FIRED');
	            
	            return this;
	        },
	        
	        
	        /**
	         * Sets the view up :)
	         *
	         * @return this for chaining
	         */
	        setup: function() {
	            Logger.debug('VIEW::SETUP FIRED');
	            var t = new Error(11, 'aaa', 'bbbb', 'ccccccccc');
	            console.log(t);
	            
	            return this;
	        }
	    };
	    
	    return View;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(errorHTML) {
	    /**
	     * Error template
	     *
	     * @param {Number} id
	     * @param {String} title
	     * @param {String} error
	     * @param {String} skin
	     */
	    var Error = function(id, title, error, skin) {
	        return errorHTML({
	            id: id,
	            title: title,
	            error: error,
	            skin: skin
	        });
	    };
	    
	    return Error;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(3)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer, API) {
	    /**
	     * gPlayer: jQuery plugin register
	     */
	    jQuery.fn.gPlayer = function (options) {
	        var args = Array.prototype.slice.call(arguments).slice(1);  //Convert it to a real Array object.
	        
	        // bind instance if none found
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(gPlayer) {
	    
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
	    
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return gPlayer;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map