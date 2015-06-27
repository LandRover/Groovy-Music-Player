define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/player.html",
], function(BaseView, Events, States, Logger, playerHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var Player = function(view) {
        Logger.debug('PLAYER::CONSTRUCTOR FIRED');
        
        this._view = view;
        
        this.init();
    };
    
    
    Player.prototype = _.extend(new BaseView(), {
        _view: null,
        _isPlaying: false,
        _state: States.IDLE,
        
        /**
         *
         */
        init: function() {
            this.subscribe();
        },
        
        
        /**
         *
         */
        subscribe: function() {
            var self = this;
            
            this.getNotifications().on(Events.STATE_CHANGED, function(state) {
                self._state = state;
                self.playPauseButtonToggle();
            });
            
            this.getNotifications().on(Events.PLAY, function(item) {
                self.setMediaProperties(item);
            });
            
            this.getNotifications().on(Events.PAUSE, function() {
                //pause
                
            });
            
            this.getNotifications().on(Events.RESIZE, function() {
                self.resizeComponents();
            });
        },
        
        
        /**
         * 
         */
        render: function() {
            var self = this;
            
            this.output = this.bindActions($(_.template(playerHTML)(
                self._view.getModel().classes
            )));
            
            return this;
        },
        
        
        /**
         *
         */
        bindActions: function(html) {
            var self = this,
                namespace = this._view.getModel().classes.namespace;
            
            $(html).find('.'+namespace +'-play').on('click', function() {
                self.getNotifications().fire(Events.QUEUE_PLAY_ACTIVE);
            });
            
            $(html).find('.'+namespace +'-pause').on('click', function() {
                self.getNotifications().fire(Events.PAUSE);
            });
            
            $(html).find('.'+namespace +'-previous').on('click', function() {
                self.getNotifications().fire(Events.PLAY_PREVIOUS);
            });
            
            $(html).find('.'+namespace +'-next').on('click', function() {
                self.getNotifications().fire(Events.PLAY_NEXT);
            });
            
            return html;
        },


        playPauseButtonToggle: function() {
            var namespace = this._view.getModel().classes.namespace;
            
            this._toggleIf(!this.isPlaying(), $('.'+ namespace +'-play'));
            this._toggleIf(this.isPlaying(), $('.'+ namespace +'-pause'));
            
            return this;
        },
        
        
        /**
         *
         */
        setMediaProperties: function(item) {
            var namespace = this._view.getModel().classes.namespace;
            
            $('.'+ namespace +'-song-artist').html($(item._model.artist));
            $('.'+ namespace +'-song-name').html(item._model.song);
            $('.'+ namespace +'-thumbnail img').attr({src: item._model.thumbnail});
            
            return this;
        },
        
        
        /**
         *
         */
        resizeComponents: function() {
            var model = this._view.getModel();
            var namespace = model.classes.namespace;
            var width = this.getWidth(),
                className = namespace +'-gui',
                elSize = '';
            
            // toggle view based on options.
            //this._toggleIf(model.waveform || model.spectrum, $('.groovy-interactive'));
            
            // toggle features based on condition
            // @todo move toggles to a proper location.. else where, where it handdles all the other stuff related to these buttons
            this._toggleIf(model.waveform, $('.groovy-scrubber'));
            this._toggleIf(model.spectrum, $('.groovy-spectrum'));
            
            if (900 <= width) {
                elSize += namespace + '-size-lg';
            } else
            if (700 <= width) {
                elSize += namespace + '-size-md';
            } else
            if (600 <= width) {
                elSize += namespace + '-size-sm';
            } else
            if (400 <= width) {
                elSize += namespace + '-size-xs';
            } else {
                elSize += namespace + '-size-xxs';
            }
            
            $('.'+className).attr({'class': className + ' ' + elSize});
            
            //this.setDynamicElementsWidth(elSize); // @todo figure out.. move else where
        },
        
        
        /**
         *
         */
        getWidth: function() {
            return $(this._view.getModel().getContainer()).width();
        },
        
        
        /**
         *
         */
        isPlaying: function() {
            return (States.PLAYING === this._state);
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this._view.getNotifications();
        },
        
        
        /**
         * Fired after the el added to the DOM, called by the BaseView
         */
        onAppend: function() {
            this.resizeComponents();
        }
    });
    
    return Player;
});