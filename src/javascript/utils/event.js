define([
    "../core",
], function(gPlayer) {
    /**
     * Event based module, publish / subscribe with herarchical events and notifiations.
     * 
     * Usage:
     *   Event.on('test_one_event', function() {
     *      console.log('test 1 event fired');
     *      console.log(arguments);
     *   });
     *
     *   Event.onOnce('test_two_event', function() {
     *      console.log('test 2 event fired, once.');
     *      console.log(arguments);
     *   });
     *
     *   var three = Event.on('test_three_event', function() {
     *      console.log('test 3 event fired');
     *   });
     *
     *   Event.fire('test_one_event', {eventID: 1}); // fires ok
     *   Event.fire('test_two_event', {eventID: 2}); // fires ok
     *   Event.fire('test_two_event', {eventID: 3}); // didnt trigger the event since it was unsubscribed (subscribed once only)
     *   three.remove(); // will remove the test_three_event
     *   Event.fire('test_three_event', {eventID: 4}); // didnt trigger, was remove line above.
     */
    var Event = {
        _subscriptions: {},
        
        /**
        * Attach a callback to an eventName
        * 
        * @param {string} eventName
        * @param {function} callback
        */
        on: function(eventName, callback) {
            if ('undefined' === typeof(this._subscriptions[eventName]))
                this._subscriptions[eventName] = [];
            
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
            var self = this,
                onceCallback = function() {
                    self.remove(eventName, onceCallback);
                    callback.apply(this, arguments);
                };
            
            // preserve the original callback to allow subscribe once method to be removed later if needed.
            onceCallback._originalCallback = callback;
            
            this.on(eventName, onceCallback);
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
            var callbacks = this._subscriptions[eventName],
                matchCallback = function(cb) {
                    return (cb === callback || cb._originalCallback === callback)
                };
            
            callbacks.forEach(function(eventCallback, i) {
                if (matchCallback(eventCallback)) {
                    callbacks.splice(i, 1);
                }
            });
            
            // if no callbacks left remove the event name from the tree completly.
            if (0 === callbacks.length) {
                delete this._subscriptions[eventName];
            }
        },
        
        
        /**
         * Removes all the subscriptions
         */
        removeAllSubscriptions: function() {
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