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
                this.parent._onPrevious(e);
            });
            
            $(html).find('.'+namespace +'-next').on('click', function() {
                this.parent._onNext(e);
            });
            
            return html;
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