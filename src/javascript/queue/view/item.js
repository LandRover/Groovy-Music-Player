define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/queue/item.html",
], function(BaseView, Events, States, Logger, itemHTML) {
    /**
     *
     */
    var Item = function(item) {
        this._model = item;
        
        this.init();
    };
    
    Item.prototype = _.extend(new BaseView(), {
        _id: null,
        _model: null,
        
        
        /**
         *
         */
        init: function() {
            this._id = this._generateUniqueID();
            
            Logger.debug('ITEM::INIT FIRED');
        },
        
        
        /**
         *
         */
        render: function() {
            this.output = this.subscribe($(_.template(itemHTML)(
                this._model
            )));
            
            return this;
        },
        
        
        /**
         *
         */
        subscribe: function(html) {
            var self = this;
            
            html.attr({
                'id': this._id
            });
            
            // @todo split to more methods.. this will become a mess very quickly
            $(html).find('.play').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PLAY, self);
            });
            
            $(html).find('.pause').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PAUSE, self);
            });
            
            $(html).find('.remove').on('click', function () {
                self.remove();
                self.getNotifications().fire(Events.QUEUE_ITEM_REMOVED, self);
            });
            
            $(html).find('strong').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_ARTIST, self);
            });
            
            $(html).data('object', this);
            
            return html;
        }
        
    });
    
    return Item;
});