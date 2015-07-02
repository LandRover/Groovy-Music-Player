define(function() {
    /**
     * Player states consts
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