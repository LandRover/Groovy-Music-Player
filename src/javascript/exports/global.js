    // Map over gPlayer in case of overwrite
    /* define window first..
    var _gPlayer = window.gPlayer;
    */
    
    gPlayer.noConflict = function(deep) {
        if (deep && window.gPlayer === gPlayer) {
           window.gPlayer = _gPlayer;
        }
    
        return gPlayer;
    };
    
    
    // Expose gPlayer even in AMD
    //if (!noGlobal) {
        //window.gPlayer = gPlayer;
    //}
    