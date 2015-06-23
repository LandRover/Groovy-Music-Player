define([
    "../core",
    "./view/item",
    "../events/events",
    "../events/states",
    "../utils/logger",
], function(gPlayer, Item, Events, States, Logger) {
    /**
     *
     */
    var Queue = function(notifications) {
        this._notifications = notifications;
        
        this.init();
    };
    
    Queue.prototype = {
        _notifications: null,
        
        init: function() {
            Logger.debug('QUEUE::INIT FIRED');
        },
        
        
        add: function(item) {
            var itemHTML = new Item(item).render();
            
            itemHTML.append('.queue');
            
            return this;
        }
    };
    
    return Queue;
});