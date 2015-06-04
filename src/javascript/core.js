define([
    "./utils/event"
], function(Event) {
    var
        version = "@VERSION",
        gPlayer,
        options = {};

    console.log('LOAD CORE 01');
    
    gPlayer = function(options) {
        console.log('GPLAYER FUNC 02');
        return new gPlayer.prototype.create(options);
    };
    
    gPlayer.prototype = {
        version: version,
        
        constructor: gPlayer
    };
    
    console.log('END CORE LOADED 001');
    console.log(gPlayer.prototype);
    
    window.ogEvent = Event;
    
    return gPlayer;
});