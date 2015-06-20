define([
    "../core",
    "../events/events",
    "../utils/logger",
    "./markup",
], function(gPlayer, Events, Logger, Markup) {
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
            
            this.layout();
            
            return this;
        },
        
        
        /**
         * 
         *
         */
        layout: function() {
            Logger.debug('VIEW::LAYOUT FIRED');
            
            this._appender(Markup.render().output, 'body');
            
            return this;
        },
        
        
        /**
         * Appending wrapper, used to inject HTML string to a target container.
         *
         * @param {string} source - string HTML structure to be inserted.
         * @param {mixed} target - selector for the target of the host.
         *
         * @return {object} - source referance after injected to the DOM.
         */
        _appender: function(source, target) {
            Logger.debug('VIEW::_APPEND FIRED');
            console.log(arguments);
            $(source).appendTo(target);
            
            return this;
        }
    };
    
    return View;
});