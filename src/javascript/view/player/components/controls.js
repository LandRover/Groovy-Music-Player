define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/components/controls.html",
], function(BaseView, Events, States, Logger, controlsHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var Controls = function(player) {
        Logger.debug('CONTROLS::CONSTRUCTOR FIRED');
        
        this._player = player;
        
        this.init();
    };
    
    
    Controls.prototype = _.extend(new BaseView(), {
        _player: null,
        
        
        /**
         *
         */
        init: function() {},
        
        
        /**
         * Structures the HTML template and gets ready to render.
         * Must happen before this.append did.
         *
         * @return this
         */
        render: function() {
            this.output = this.bindActions($(_.template(controlsHTML)(
                this._player._view.getModel().classes
            )));
            
            return this;
        },
        
        
        /**
         * Binds actions to the HTML view, attaching events on UI actions.
         *
         * @param {String} html
         * @return {String} html with binds
         */
        bindActions: function(html) {
            var self = this,
                namespace = this._player._view.getModel().classes.namespace;
            
            html.find('.'+namespace +'-play').on('click', function() {
                self.getNotifications().fire(Events.QUEUE_PLAY_ACTIVE);
            });
            
            html.find('.'+namespace +'-pause').on('click', function() {
                self.getNotifications().fire(Events.PAUSE);
            });
            
            html.find('.'+namespace +'-previous').on('click', function() {
                self.getNotifications().fire(Events.PLAY_PREVIOUS);
            });
            
            html.find('.'+namespace +'-next').on('click', function() {
                self.getNotifications().fire(Events.PLAY_NEXT);
            });

            return html;
        },
        
        /**
         *
         */
        getNotifications: function() {
            return this._player._view.getNotifications();
        }
    });
    
    return Controls;
});