define([], function() {
    /**
     * Player states list
     */
    var States = {
        LOADING: "LOADING",
        STALLED: "STALLED",
        
        BUFFERING : "BUFFERING",
        IDLE: "IDLE",
        COMPLETE: "COMPLETE",
        PAUSED: "PAUSED",
        PLAYING: "PLAYING",
        CROSSFADING: "CROSSFADING",
        ERROR: "ERROR"
    };
    
    return States;
});