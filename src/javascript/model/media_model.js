define([
    "../core",
    "./base_model",
    "../events/states",
], function(gPlayer, BaseModel, States) {
    var MediaModel = $.extend(true, {
        state: States.IDLE
    }, new BaseModel);
    
    return MediaModel;
});