define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/components/info_minimal.html",
], function(BaseView, Events, States, Logger, infoMinimalHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var InfoMinimal = function(player) {
        Logger.debug('INFOMINIMAL::CONSTRUCTOR FIRED');
        
        this._player = player;
        
        this.init();
    };
    
    
    InfoMinimal.prototype = _.extend(new BaseView(), {
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
            var self = this;
            
            this.output = $(_.template(infoMinimalHTML)(
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
    
    return InfoMinimal;
});