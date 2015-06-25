define([
    "core",
    "queue/view/item",
    "events/events",
    "events/states",
    "utils/logger",
], function(gPlayer, Item, Events, States, Logger) {
    /**
     * Main queue controller
     *
     * Acts as the view controller, fetching and adding models and causing changes to the UI
     * from this object.
     */
    var Queue = function(notifications) {
        this._notifications = notifications;
        
        this.init();
    };
    
    Queue.prototype = {
        _notifications: null,
        
        
        /**
         *
         */
        init: function() {
            Logger.debug('QUEUE::INIT FIRED');
            
            this.subscribe();
        },
        
        
        /**
         *
         */
        subscribe: function() {
            var self = this;
            
            this._notifications.on([Events.QUEUE_ITEM_ADDED, Events.QUEUE_ITEM_REMOVED], function() {
                self._notifications.fire(Events.QUEUE_ITEM_UPDATED, items.length);
            });
        },
        
        
        /**
         *
         */
        add: function(items, to) {
            var itemObj,
                self = this;
            
            _.each(items, function(item) {
                itemObj = new Item(item)
                    .render()
                    .append('.'+ self.getDomParent());
                
                self._notifications.fire(Events.QUEUE_ITEM_ADDED, itemObj);
            });
            
            this._notifications.fire(Events.QUEUE_ITEM_ADD_COMPLETE, items.length);
            
            return this;
        },
        
        
        /**
         * Gets the queue size, length of the current list
         *
         * @return {Number}
         */
        getSize: function () {
            return this.getDomParent()
                .find('li:not(.cancel)')
                .size();
        },
        
        
        /**
         *
         */
        getDomParent: function() {
            return this.getController()
                .getModel()
                .classes
                .queue;
        },
        
        
        /**
         *
         */
        getController: function() {
            return gPlayer()
                .getController();
        }
    };
    
    return Queue;
});