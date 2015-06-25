define([
    "core",
    "utils/logger"
], function(gPlayer, Logger) {
    /**
     * Base View, all views inherit this shared and basic logic.
     *
     * Provides basic render and appenders for the view.
     */
    var BaseView = function() {
        Logger.debug('BASEVIEW::CONSTRUCTOR FIRED');
    };
    
    
    BaseView.prototype = {
        output: '',
        el: null,
        _position: null,
        
        /**
         * Adds element to the dom
         */
        append: function(to) {
            Logger.debug('BASEVIEW::APPEND FIRED '+ to);
            
            this.el = this.output;
            $(to).append(this.el);
            
            return this;
        },
        
        
        /**
         * Removes element from the dom.
         */
        remove: function() {
            if (null === this.el) {
                Logger.debug('el is null, never added, probably.');
                return;
            }
            
            Logger.debug('REMOVING EL', this.el);
            
            this.el.remove();
        },
        
        
        getPosition: function() {
            return (null !== this._position) ? this._position : this.el.index();
        },

        
        /**
         *
         */
        cachePosition: function() {
            this._position = this.el.index();
            
            return this;
        },
        
        
        /**
         *
         */
        toString: function() {
            return this.output;
        },
        
        
        /**
         *
         */
        getController: function() {
            return gPlayer().getController();
        },
        
        
        /**
         *
         */
        getModel: function() {
            return this.getController().getModel();
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this.getController().getNotifications();
        },
        
        
        /**
         * Random ID generator for appended objects.
         *
         * Math.random should be unique because of its seeding algorithm.
         * Convert it to base 36 (numbers + letters), and grab
         * the first 9 characters after the decimal.
         *
         * @return {String} - Sample ID looks like: "_619z73eci"
         */
        _generateUniqueID: function () {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
    };
    
    return BaseView;
});