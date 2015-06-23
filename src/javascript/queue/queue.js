define([
    "../events/events",
    "../events/states",
    "../utils/logger",
], function(Events, States, Logger) {
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
        }
    };
    
    return Queue;
});