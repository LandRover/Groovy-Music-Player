define([
    "utils/event",
    "events/events",
    "utils/logger",
], function(Event, Events, Logger) {
    /**
     * Base Model, all models inherit this shared and basic logic.
     *
     * Provides basic setter and getter capability
     * and on change broadcasts an event with the changes anyone can subscribe.
     */
    var BaseModel = function() {
        //Logger.debug('BASEMODEL::CONSTRUCTOR FIRED!');
        $.extend(true, this, new Event);
    };
    
    BaseModel.prototype = {
        /**
         * Getter for the model internals
         *
         * @param {String} key
         * @param {Mixed} defaultValue - if nothing found, will return the default
         * @return {Mixed} stored data or the default value is returned.
         */
        get: function(key, defaultValue) {
            return ('undefined' !== typeof(this[key]) ? this[key] : defaultValue);
        },
        
        
        /**
         * Setter for the model internals
         *
         * @param {String} key
         * @param {Mixed} value
         * @return this for easy chaining.
         */
        set: function(key, value) {
            var oldValue = this[key];
            
            //check same value exists, prevents the event from firing since nothing changed.
            if (value !== oldValue) {
                this[key] = value;
                this.on(Events.CHANGE + key, this, value, oldValue);
            }
            
            return this;
        }
    };
    
    return BaseModel;
});