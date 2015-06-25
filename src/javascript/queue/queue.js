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
            
            this._notifications.on([Events.QUEUE_ITEM_ADDED, Events.QUEUE_ITEM_REMOVED], function(item) {
                self._notifications.fire(Events.QUEUE_ITEM_UPDATED, item);
            });
            
            this._notifications.on(Events.QUEUE_ITEM_UPDATED, function(item) {
                self.updateList(item);
            });
        },
        
        
        /**
         *
         */
        add: function(items, to) {
            var itemObj;
            
            _.each(items, function(item) {
                itemObj = new Item(item)
                    .render()
                    .append('.'+ this.getDomParent());
                
                this._notifications.fire(Events.QUEUE_ITEM_ADDED, itemObj);
            }, this);
            
            this._notifications.fire(Events.QUEUE_ITEM_ADD_COMPLETE, items.length);
            
            return this;
        },
        
        
        /**
         *
         */
        updateList: function(item) {

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