define([
    "../core",
    "../events/events",
    "../events/states",
    "../utils/logger",
], function(gPlayer, Events, States, Logger) {
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
        
        
        add: function(items) {
            
        }
    };
    
    return Queue;
});