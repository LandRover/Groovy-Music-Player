define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/components/info.html",
], function(BaseView, Events, States, Logger, infoHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var Info = function(player) {
        Logger.debug('INFO::CONSTRUCTOR FIRED');
        
        this._player = player;
        
        this.init();
    };
    
    
    Info.prototype = _.extend(new BaseView(), {
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
            this.output = $(_.template(infoHTML)(
                this._player._view.getModel().classes
            ));
            
            return this;
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this._player._view.getNotifications();
        }
    });
    
    return Info;
});