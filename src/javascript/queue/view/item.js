define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/queue/item.html",
], function(BaseView, Events, States, Logger, itemHTML) {
    /**
     * Queue Item view object.
     *
     * Represents the view of the queue item, binds all clicks and ui listeners to this instance
     */
    var Item = function(item) {
        this._model = item;
        
        this.init();
    };
    
    
    Item.prototype = _.extend(new BaseView(), {
        _id: null,
        _model: null,
        
        
        /**
         * Constructor method, called during construction
         */
        init: function() {
            Logger.debug('ITEM::INIT FIRED');
            
            this._id = this._generateUniqueID();
        },
        
        
        /**
         * Rendering the output object
         * 
         * @return {Object} Item instance
         */
        render: function() {
            this.output = $(_.template(itemHTML)(
                this._model
            ));
            
            this.bindActions();
            
            return this;
        },
        
        
        /**
         * Bind clicks to the output HTMLElement
         */
        bindActions: function() {
            var self = this,
                html = this.output;
            
            html.attr({
                id: this._id
            });
            
            // @todo split to more methods.. this will become a mess very quickly
            html.find('.play').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PLAY, self);
            });
            
            html.find('.pause').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PAUSE, self);
            });
            
            html.find('.remove').on('click', function () {
                self.cachePosition();
                self.remove();
                self.getNotifications().fire(Events.QUEUE_ITEM_REMOVED, self);
            });
            
            html.find('strong').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_ARTIST, self);
            });
            
            html.data('object', this);
        }
    });
    
    return Item;
});