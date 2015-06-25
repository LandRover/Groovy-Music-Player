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
            
            this._notifications.on(Events.QUEUE_ITEM_CLICK_PLAY, function(item) {
                self._notifications.fire(Events.QUEUE_ITEM_SET_ACTIVE, item);
            });
            
            this._notifications.on(Events.QUEUE_ITEM_SET_ACTIVE, function(item) {
                self.setActive(item.getPosition());
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
                    .append(this.getDomParent());
                
                this._notifications.fire(Events.QUEUE_ITEM_ADDED, itemObj);
            }, this);
            
            this._notifications.fire(Events.QUEUE_ITEM_ADD_COMPLETE, items.length);
            
            return this;
        },
        
        
        /**
         *
         */
        updateList: function(item) {
            var size = this.getSize(),
                itemPosition = item.getPosition(); // @todo unable to get proper position as the item was already removed inside the item.
            
            if (this.isEmpty()) {
                this._notifications.fire(Events.QUEUE_EMPTY);
            }
            
            //active song has been changed, set the next on active mode.
            if (null === this.getActive()) {
                //the active was the last on the playlist, select the new last.
                if (itemPosition === size)
                    itemPosition = size - 1;
                
                if (!this.isEmpty()) {
                    this.setActive(itemPosition);
                    //this._onPlay(this._getItemByIndex(itemPosition)); //@todo activate.
                }
            }
        },
        
        
        /**
         * Get the active song from the queue and the next and previous songs as an option
         *
         * @param {Number} prevNext (-1 - previous item, 0 - current item (default value), 1 - next item)
         * @return {Object} jQuery selector of the active object (or next, previous.. etc.)
         */
        getActive: function (prevNext) {
            var item = (-1 === this.getDomParent().find('li.active').index()) ? null : this.getDomParent().find('li.active'),
                direction = prevNext || 0,
                ret = null,
                index = null;
            
            if (null !== item) {
                index = item.index() + direction;
                
                if (0 <= index)
                    ret = this._getItemByIndex(index);
            }
            
            return ret;
        },
        
        
        /**
         * Sets the active queue item by IndexID.
         *
         * @param {Number} index - index of the item to be set active.
         * @return {Object} jQuery selector of the new active object after the change
         * 
         * @todo: make better, remove the last active more efficently - keep track of the last played item. (might become an issue on longer lists)
         */
        setActive: function (index) {
            var item = this._getItemByIndex(index);
            
            // verify if index exists.
            if (null === item || (null !== this.getActive() && (
                //prevent from re-setting the current active item again.
                this.getActive().index() === item.index() &&
                true === this.isPlaying()
            ))) return null; //now playing similar to currently playing song.
            
            // Sets active flag on the index
            this.getDomParent().find('li').removeClass('active');
            item.addClass('active');
        
            // Fires the event notifying the item change.
            this._notifications.fire(Events.QUEUE_ITEM_CHANGED_ACTIVE, item.data('object'));
            
            return item;
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
        isEmpty: function() {
            return (0 >= this.getSize());
        },
        
        
        /**
         *
         */
        getDomParent: function() {
            return $('.' + this.getController()
                .getModel()
                .classes
                .queue);
        },
        
        
        /**
         *
         */
        getController: function() {
            return gPlayer()
                .getController();
        },
        
        
        /**
         *
         */
        _getItemByIndex: function (index) {
            var item = this.getDomParent()
                .find('li:not(.cancel)')
                .eq(index);
        
            return (0 > item.index()) ? null : item;
        }
    };
    
    return Queue;
});