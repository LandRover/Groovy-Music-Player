define([
    "../model/model",
    "../view/view",
    "../queue/queue",
    "../events/events",
    "../events/states",
    "../utils/event",
    "../utils/logger",
], function(Model, View, Queue, Events, States, Event, Logger) {
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
         * Referances
         */
        _view: null,
        _model: null,
        _queue: null,
        _notifications: null,
        
        
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
            this._view = new View(this, this._notifications);
            this._queue = new Queue(this._notifications);
            
            return this;
        },
        
        
        /**
         * Bootstraps the main controller
         */
        bootstrap: function(container) {
            this._model.setup(container);
            this._view.setup();
        },
        
        
        /**
         * Getter for the Queue object, set on constructor
         */
        getQueue: function() {
            return this._queue;
        },
        
        
        /**
         * Getter for the Queue object, set on constructor
         */
        getModel: function() {
            return this._model;
        },
        
        
        /**
         * Random ID generator for appended objects.
         *
         * Math.random should be unique because of its seeding algorithm.
         * Convert it to base 36 (numbers + letters), and grab
         * the first 9 characters after the decimal.
         *
         * @return {String} - Sample ID looks like: "_619z73eci"
         */
        _generateUniqueID: function () {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
    };
    
    return Controller;
});