define([
    "../core",
    "./base_model",
    "../events/states",
], function(gPlayer, BaseModel, States) {
    /**
     * Media Model
     */
    var MediaModel = function() {
    };
    
    MediaModel.prototype = $.extend(true, {
        state: States.IDLE
    }, new BaseModel);
    
    return MediaModel;
});