define([
    "controller/channel",
    "model/model",
    "view/view",
    "queue/queue",
    "events/events",
    "events/states",
    "utils/event",
    "utils/logger",
], function(Channel, Model, View, Queue, Events, States, Event, Logger) {
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
        
        _channels: [],
        _state: States.IDLE,
        
        
        
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
            
            this.subscribe();
            
            return this;
        },
        
        
        /**
         *
         */
        subscribe: function() {
            var self = this;
            
            this.getNotifications().on(Events.STATE_CHANGED, function(state) {
                self._state = state;
            });
            
            this.getNotifications().on(Events.PLAY, function(item) {
                console.log(['CONTROLLER::ITEM ARRIVED', item]);
                self.channelAdd(item);
                self.changeState(States.PLAYING);
            });
            
            this.getNotifications().on(Events.PAUSE, function() {
                self.changeState(States.PAUSED);
            });
            
            $(window).bind('resize', function() {
                self.getNotifications().fire(Events.RESIZE);
            });
            
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
         * Getter for the Model object, set on constructor
         */
        getModel: function() {
            return this._model;
        },
        
        
        /**
         * Getter for the Notifications object, set on constructor
         */
        getNotifications: function() {
            return this._notifications;
        },
        
        
        /**
         *
         */
        changeState: function(newState) {
            if (newState === this._state) return;
            
            this.getNotifications().fire(Events.STATE_CHANGED, newState);
        },
        
        
        /**
         *
         */
        isPlaying: function() {
            for (var i = 0, len = this._channels.length; i < len; i++) {
                if ('undefined' !== typeof(this._channels[i]) && true === this._channels[i].isPlaying())
                    return true;
            }
        
            return false;
        },
        
        
        /**
         *
         */
        channelAdd: function (item) {
            var channelNew = new Channel({
                parent: this,
                item: item
            });
            
            this._channels.push(channelNew);
            channelNew.mediaPlay();
            
            return this;
        },
        
        /**
         *
         */
        getActiveChannel: function() {
            return this._channels[0]; //channel 0 is the active.. 1 is usually created only while crossfading and even then.. 0 is the active.
        },
        
        
        /**
         *
         */
        getActiveAudio: function() {
            return this.getActiveChannel().audioEl;
        }
    };
    
    return Controller;
});