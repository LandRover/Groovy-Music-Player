define([
    "../core",
    "../events/events",
    "../utils/logger",
    "../view/error",
], function(gPlayer, Events, Logger, Error) {
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
            var t = Error.render(11, 'aaa', 'bbbb', 'ccccccccc');
            t.append('body');
            
            return this;
        }
    };
    
    return View;
});