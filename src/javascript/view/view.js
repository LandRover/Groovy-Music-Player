define([
    "events/events",
    "utils/logger",
    "view/gplayer_view",
    "view/player/player",
    "nativesortable",
    "mCustomScrollbar"
], function(Events, Logger, gPlayerView, Player, NativeSortable, mCustomScrollbar) {
    /**
     * View
     */
    var View = function(controller, notifications) {
        this._controller = controller;
        this._notifications = notifications;
        
        this.init(); // init constructor
    };
    
    View.prototype = {
        _model: null,
        _controller: null,
        _notifications: null,
        
        
        /**
         * Constructor for the view.
         *
         * @return this for chaining
         */
        init: function() {
            Logger.debug('VIEW::INIT FIRED');
            
            return this;
        },
        
        
        /**
         * Sets the view up :)
         *              
         * @return this for chaining
         */
        setup: function() {
            Logger.debug('VIEW::SETUP FIRED');
            
            this.layout();
            
            return this;
        },
        
        
        /**
         * 
         *
         */
        layout: function() {
            Logger.debug('VIEW::LAYOUT FIRED');
            
            var gPlayerViewLayout = new gPlayerView(this)
                .append(this.getModel()
                .getContainer());
            
            $(this.getModel().getContainer())
                .addClass('orange')
                .addClass(this.getModel().classes.gPlayer)
                .addClass(this.getModel().classes.draggable_queue)
                .addClass(this.getModel().classes.size)
                .addClass(this.getModel().classes.empty);
            
            var PlayerView = new Player(this)
                .render()
                .append('.'+this.getModel().classes.player_wrapper);
            
            // @todo move this out.. to queue as it should append itself
            NativeSortable(document.querySelector('.queue'), {
                change: onchange,
                childClass: 'sortable-child',
                draggingClass: 'sortable-dragging',
                overClass: 'sortable-over'
            });
            
            this.horizontalScrollInit();
            
            return this;
        },
        
        
        // @todo move this out.. to queue as it should append itself
        horizontalScrollInit: function() {
            mCustomScrollbar($); // @todo Figure what's the deal with the mouseheel plugin.. 
            
            $('.'+this.getModel().classes.queue_container).mCustomScrollbar({
                    scrollInertia: 150,
                    
                    onTotalScrollOffset: 40,
                    onTotalScrollBackOffset: 20,
                    
                    mouseWheel: true,
                    horizontalScroll: true,
                    
                    advanced:{
                        autoExpandHorizontalScroll: true
                    }
            });
            
            this.horizontalScrollUpdate();
        },
        
        // @todo move this out.. to queue as it should append itself
        horizontalScrollUpdate: function() {
            $('.'+this.getModel().classes.queue_container).mCustomScrollbar('update');
            
            if ($('.mCustomScrollBox .mCSB_container')) {
                var width = $('.mCustomScrollBox .mCSB_container').css('width') || '0px';
                var widthPX = Number(width.replace('px', ''));
                
                if (widthPX <= window.innerWidth) {
                    $('.mCustomScrollBox .mCSB_container').css('width', '100%');
                }
            }
        },
        
        
        /**
         *
         *
         */
        getModel: function() {
            return this._controller.getModel();
        },
        
        
        /**
         *
         *
         */
        getNotifications: function() {
            return this._notifications;
        },
        
        
        /**
         * Appending wrapper, used to inject HTML string to a target container.
         *
         * @param {String} source - string HTML structure to be inserted.
         * @param {Mixed} target - selector for the target of the host.
         *
         * @return {Object} - source referance after injected to the DOM.
         */
        _appender: function(source, target) {
            Logger.debug('VIEW::_APPEND FIRED');
            
            console.log(arguments);
            
            return $(source).appendTo(target);
        }
    };
    
    return View;
});