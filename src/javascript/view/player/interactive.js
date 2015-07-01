define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/interactive.html",
], function(BaseView, Events, States, Logger, interactiveHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var Interactive = function(player) {
        Logger.debug('INTERACTIVE::CONSTRUCTOR FIRED');
        
        this._player = player;
        
        this.init();
    };
    
    
    Interactive.prototype = _.extend(new BaseView(), {
        _player: null,
        
        
        /**
         *
         */
        init: function() {},
        
        
        /**
         * Structures the HTML template and gets ready to render.
         * Must happen before this.append did.
         *
         * @return this
         */
        render: function() {
            var self = this;
            
            this.output = this.bindActions($(_.template(interactiveHTML)(
                self._player._view.getModel().classes
            )));
            
            return this;
        },
        
        
        /**
         * Binds actions to the HTML view, attaching events on UI actions.
         *
         * @param {String} html
         * @return {String} html with binds
         */
        bindActions: function(html) {
            var self = this;
            var scrubber = function(e) {
                self.mouseScrubbar(e);
            };
            
            html.bind('mousemove', scrubber);
            html.bind('mouseleave', scrubber);
            html.bind('click', scrubber);
            
            return html;
        },
        
        
        /**
         *
         * @todo Change to event based.. when position is calucalted - BRAODCAST it.. rather than find the active channel and change the media position.
         * exposes too much of internals
         *
         */
        mouseScrubbar: function(e) {
            var mouseX = e.pageX,
                channel = this._player._view.getController().getActiveChannel();
            
            switch(e.type) {
                case 'mousemove':
                    this.el.children('.groovy-scrubber-hover').css({
                        left: (mouseX - this.el.offset().left)
                    });
                    
                    break;
                
                case 'click': 
                    var timeTotal = channel.audioEl.duration;
                    var position = ((mouseX - (this.el.offset().left)) / this.getWidth() * timeTotal);
                    channel.mediaPlay(position);
                    
                    // @todo figure this one out, could be a bug.. if isPlaying is false.. wont jump to the proper position.
                    //if (true !== this.isPlaying()) {
                    //    channel.mediaPlay();
                    //}
                    
                    break;
            }
        },
        
        
        /**
         *
         */
        getScrubberWidthMinimal: function() {
            return $('.groovy-seek-bar').width();
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this._player._view.getNotifications();
        }
    });
    
    return Interactive;
});