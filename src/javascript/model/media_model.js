define([
    "../core",
    "./base_model",
    "../events/states",
], function(gPlayer, BaseModel, States) {
    var MediaModel = $.extend(true, new BaseModel, {
        state: States.IDLE
    });
    
    return MediaModel;
});