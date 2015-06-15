define([
    "../core",
    "../events/event",
], function(gPlayer, Event) {
    /**
     * Base Model, all models inherit this shared and basic logic.
     *
     * Provides basic setter and getter capability
     * and on change broadcasts an event with the changes anyone can subscribe.
     */
    var BaseModel = $.extend(true, {
        _data: {},
        
        /**
         * Getter for the model internals
         *
         * @param {String} key
         * @param {Mixed} defaultValue - if nothing found, will return the default
         * @return {Mixed} stored data or the default value is returned.
         */
        get: function(key, defaultValue) {
            return ('undefined' !== typeof(this._data[key]) ? this._data[key] : defaultValue);
        },
        
        
        /**
         * Setter for the model internals
         *
         * @param {String} key
         * @param {Mixed} value
         * @return this for easy chaining.
         */
        set: function(key, value) {
            var oldValue = this._data[key];
            
            //check same value exists, prevents the event from firing since nothing changed.
            if (value !== oldValue) {
                this._data[key] = value;
                this.on('change:'+ key, this, value, oldValue);
            }
            
            return this;
        }
    }, new Event);
    
    return BaseModel;
});