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
     *   Event.once('test_two_event', function() {
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
     *   three.off(); // will remove the test_three_event
     *   Event.fire('test_three_event', {eventID: 4}); // didnt trigger, was remove line above.
     */
    var Event = function() {};
    
    Event.prototype = {
        _subscriptions: {},
        
        /**
        * Attach a callback to an EventName
        * 
        * @param {string} name
        * @param {function} callback
        */
        on: function(name, callback) {
            if ('undefined' === typeof(this._subscriptions[name]))
                this._subscriptions[name] = [];
            
            var index = this._subscriptions[name].push(callback) - 1,
                self = this;
            
            // return back a clean remove function with the params encaspulated
            return (function(name, callback) {
                return {
                    off: function() {
                        return self.off(name, callback);
                    }
                };
            })(name, callback);
        },
        
        
        /**
        * Attach a callback to an name, but once only. Will disapear after first execution.
        * 
        * @param {string} name
        * @param {function} callback
        */
        once: function(name, callback) {
            var self = this,
                onceCallback = function() {
                    self.off(name, onceCallback);
                    callback.apply(this, arguments);
                };
            
            // preserve the original callback to allow subscribe once method to be removed later if needed.
            onceCallback._originalCallback = callback;
            
            this.on(name, onceCallback);
        },
        
        
        /**
        * Notify subscriptions by calling their name
        * 
        * @param {string} name
        * @param {object} params
        */
        fire: function(name, params) {
            var callbacks = this._subscriptions[name] || [];
            
            callbacks.forEach(function(callback) {
                callback(params);
            });
        },
        
        
        /**
        * Remove a specific name callback from the stack
        * 
        * @param {string} name
        * @param {function} callback
        */
        off: function(name, callback) {
            var callbacks = this._subscriptions[name],
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
                delete this._subscriptions[name];
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