define([
    "view/base_view",
    "utils/logger",
    "html/layout/player/player.html",
], function(BaseView, Logger, playerHTML) {
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
         * Constructor, actually generates the output from a template;
         */
        init: function() {
            this.output = _.template(playerHTML)(
                this._view.getModel().classes
            );
        }
    });
    
    return Player;
});