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
            
            this.getNotifications().on(Events.PLAY, function(item) {
                self.setIsPlaying(true)
                    .playPauseButtonToggle()
                    .setMediaProperties(item);
            });
            
            this.getNotifications().on(Events.PAUSE, function() {
                self.setIsPlaying(false)
                    .playPauseButtonToggle();
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
            var isPlaying = this.isPlaying(),
                namespace = this._view.getModel().classes.namespace;
            
            this._toggleIf(!isPlaying, $('.'+namespace +'-play'));
            this._toggleIf(isPlaying, $('.'+namespace +'-pause'));
            
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
        isPlaying: function() {
            return this._isPlaying;
        },
        
        
        /**
         *
         */
        setIsPlaying: function(state) {
            this._isPlaying = state;
            
            return this;
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this._view.getNotifications();
        }
    });
    
    return Player;
});