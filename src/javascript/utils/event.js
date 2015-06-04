define([
    "../core",
], function(gPlayer) {
    /**
     * Event based module, publish / subscribe with herarchical events and notifiations.
     */
    var Event = {
        _subscriptions: [],
        
        /**
        * Attach a callback to an eventName
        * 
        * @param {string} eventName
        * @param {function} callback
        */
        on: function(eventName, callback) {
            var index = this._subscriptions[eventName].push(callback) - 1,
                self = this;
            
            // return back a clean remove function with the params encaspulated
            return (function(eventName, callback) {
                return {
                    remove: function() {
                        return self.remove(eventName, callback);
                    }
                };
            })(eventName, callback);
        },
        
        
        /**
        * Attach a callback to an eventName, but once only. Will disapear after first execution.
        * 
        * @param {string} eventName
        * @param {function} callback
        */
        onOnce: function(eventName, callback) {
            var self = this;
            
            this.on(eventName, function() {
                self.remove(eventName, this);
                callback.apply(this, arguments);
            });
        },
        
        
        /**
        * Notify subscriptions by calling their eventName
        * 
        * @param {string} eventName
        * @param params
        */
        fire: function(eventName, params) {
            var callbacks = this._subscriptions[eventName] || [];
            
            callbacks.forEach(function(callback) {
                callback(params);
            });
        },
        
        
        /**
        * Remove a specific eventName callback from the stack
        * 
        * @param {string} eventName
        * @param {function} callback
        */
        remove: function(eventName, callback) {
            var callbacks = this._subscriptions[eventName];
            
            callbacks.forEach(function(eventCallback, i) {
                if (eventCallback === callback) {
                    this._subscriptions.splice(i, 1);
                }
            });
        },
        
        
        /**
         * Removes all the subscriptions
         */
        removeAll_subscriptions: function() {
            this._subscriptions = [];
        },
        
        
        /**
         * Get all the active subscriptions tree
         */
        getAllSubscriptions: function() {
            return this._subscriptions;
        }
    };
    
    return Event;
});