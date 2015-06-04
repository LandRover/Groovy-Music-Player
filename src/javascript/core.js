define([
    "./utils/event"
], function(Event) {
    var version = "@VERSION",
        gPlayer;

    console.log('LOAD CORE 01');
    
    gPlayer = function(options) {
        console.log('GPLAYER FUNC 02');
        return new gPlayer.prototype.create(options);
    };
    
    gPlayer.prototype = {
        options = {},
        
        version: version,
        
        constructor: gPlayer
    };
    
    console.log('END CORE LOADED 001');
    console.log(gPlayer.prototype);
    
    return gPlayer;
});