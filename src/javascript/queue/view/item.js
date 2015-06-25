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
            var item = this._model,
                self = this;
            
            html.attr({
                'id': this._id
            });
            
            $(html).find('.play').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PLAY, item);
            });
            
            $(html).find('.pause').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PAUSE, item);
            });
            
            $(html).find('.remove').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_REMOVED, item);
                self.remove();
            });
            
            $(html).find('strong').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_ARTIST, item);
            });
            
            return html;
        }
        
    });
    
    return Item;
});