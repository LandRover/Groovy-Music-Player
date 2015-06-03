define([
    "./core",
    "./utils/logger",
    "./core/init",
], function(gPlayer, Logger) {
    
    var Player = function() {
       this.init();
    };
    
    Player.prototype = {
        init: function() {
            Logger.debug('Player constructor fired.');
        }
    };
    
    return Player;
});