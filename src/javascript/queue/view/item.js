define([
    "../../view/base_view",
    "../../events/events",
    "../../events/states",
    "../../utils/logger",
    "html/queue/item.html",
], function(BaseView, Events, States, Logger, itemHTML) {
    /**
     *
     */
    var Item = function(item) {
        this._item = item;
        
        this.init();
    };
    
    Item.prototype = _.extend(new BaseView(), {
        _item: null,
        
        
        init: function() {
            Logger.debug('ITEM::INIT FIRED');
        },
        
        
        render: function() {
            this.output = this.subscribe($(_.template(itemHTML)(
                this._item
            )));
            
            return this;
        },
        
        
        /**
         *
         */
        subscribe: function(html) {
            var item = this._item,
                self = this;
            
            html.attr({
                'id': this._generateUniqueID()
            });
            
            $(html).find('.play').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PLAY, item);
            });
            
            $(html).find('.pause').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_PAUSE, item);
            });
            
            $(html).find('.remove').on('click', function () {
                self.getNotifications().fire(Events.QUEUE_ITEM_CLICK_REMOVE, item);
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