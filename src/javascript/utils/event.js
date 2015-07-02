define(function() {
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
        * @param {String/Array} name
        * @param {Function} callback
        * @param {Object} context
        */
        on: function(name, callback, context) {
            context = context || this;
            
            // allows to subscribe multiple events for the same callback as single events. Clears the syntax on the other end.
            if (_.isArray(name)) {
                return _.each(name, function(eventName) {
                    this.on(eventName, callback, context);
                }, this);
            }
            
            if ('undefined' === typeof(this._subscriptions[name]))
                this._subscriptions[name] = [];
            
            var index = this._subscriptions[name].push({
                    callback: callback,
                    context: context
                })-1,
                self = this;
            
            // return back a clean remove function with the params encaspulated
            return (function(name, callback, context) {
                return {
                    off: function() {
                        return self.off(name, callback, context);
                    }
                };
            })(name, callback, context);
        },
        
        
        /**
        * Attach a callback to an name, but once only. Will disapear after first execution.
        * 
        * @param {String} name
        * @param {Function} callback
        * @param {Object} context
        */
        once: function(name, callback, context) {
            var self = this,
                onceCallback = function() {
                    self.off(name, onceCallback, context);
                    callback.apply(this, arguments);
                };
            
            // preserve the original callback to allow subscribe once method to be removed later if needed.
            onceCallback._originalCallback = callback;
            
            this.on(name, onceCallback, context);
        },
        
        
        /**
        * Notify subscriptions by calling their name
        * 
        * @param {String} name
        * @param {Object} params
        */
        fire: function(name, params) {
            var events = this._subscriptions[name] || [];
            
            console.log(['EVENT::FIRE', name, params]);
            
            _.each(events, function(event) {
                event.callback.call(event.context, params);
            });
        },
        
        
        /**
        * Remove a specific name callback from the stack
        * 
        * @param {String} name
        * @param {Function} callback
        * @param {Object} context
        */
        off: function(name, callback, context) {
            context = context || this;
            
            var events = this._subscriptions[name],
                matchCallback = function(cb) {
                    return (cb === callback || cb._originalCallback === callback)
                };
            
            _.each(events, function(event, i) {
                if (matchCallback(event.callback)) {
                    events.splice(i, 1);
                }
            });
            
            // if no callbacks left remove the event name from the tree completly.
            if (0 === events.length) {
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