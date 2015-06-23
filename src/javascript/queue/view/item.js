define([
    "../base_view",
    "../events/events",
    "../events/states",
    "../utils/logger",
    "html/queue/item.html",
], function(BaseView, Events, States, Logger, itemHTML) {
    /**
     *
     */
    var Item = function(item) {
        this._item = item;
        
        this.init();
    };
    
    Item.prototype = _.extend(new BaseView(), {
        _item: null,
        
        
        init: function() {
            Logger.debug('ITEM::INIT FIRED');
            
            console.log(itemHTML);
        },
        
        
        render: function() {
            
        }
    });
    
    return Item;
});