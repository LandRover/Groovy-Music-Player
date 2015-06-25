define([
    "model/base_model",
    "events/states",
], function(BaseModel, States) {
    /**
     * Media Model
     */
    var MediaModel = function() {
    };
    
    MediaModel.prototype = _.extend({
        state: States.IDLE
    }, new BaseModel);
    
    return MediaModel;
});