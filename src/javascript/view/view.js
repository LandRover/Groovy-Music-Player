define([
    "../events/events",
    "../utils/logger",
    "./gplayer_view",
    "./player/player",
], function(Events, Logger, gPlayerView, Player) {
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
            
            var gPlayer = new gPlayerView(this).append(this.getModel().getContainer());
            
            $(this.getModel().getContainer())
                .addClass(this.getModel().classes.gPlayer)
                .addClass(this.getModel().classes.draggable_queue)
                .addClass(this.getModel().classes.size)
                .addClass(this.getModel().classes.empty);
            
            var PlayerView = new Player(this).append('.'+this.getModel().classes.player_wrapper);
            
            console.log(this.getModel().classes.player_wrapper);
            console.log(this.getModel().classes);
            
            return this;
        },
        
        
        /**
         *
         *
         */
        getModel: function() {
            return this._model;
        },
        
        /**
         * Appending wrapper, used to inject HTML string to a target container.
         *
         * @param {String} source - string HTML structure to be inserted.
         * @param {Mixed} target - selector for the target of the host.
         *
         * @return {Object} - source referance after injected to the DOM.
         */
        _appender: function(source, target) {
            Logger.debug('VIEW::_APPEND FIRED');
            
            console.log(arguments);
            
            return $(source).appendTo(target);
        }
    };
    
    return View;
});