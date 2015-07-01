define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/volume.html",
], function(BaseView, Events, States, Logger, volumeHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var Volume = function(player) {
        Logger.debug('VOLUME::CONSTRUCTOR FIRED');
        
        this._player = player;
        this.init();
    };
    
    
    Volume.prototype = _.extend(new BaseView(), {
        _player: null,
        
        /**
         *
         */
        init: function() {
            var self = this;
            
            this.getNotifications().on(Events.VOLUME_SET, function(volume) {
                self.setVolumeBar(volume);
            });
        },
        
        
        /**
         * Structures the HTML template and gets ready to render.
         * Must happen before this.append did.
         *
         * @return this
         */
        render: function() {
            var self = this;
            
            this.output = this.bindActions($(_.template(volumeHTML)(
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
            var self = this,
                namespace = this._player._view.getModel().classes.namespace;
            
            html.find('.'+namespace +'-volume-progress-bg').bind('click', function(e) {
                self.mouseVolumeControl(e);
            });
            
            html.find('.'+namespace +'-mute').bind('click', function() {
                self.getNotifications().fire(Events.VOLUME_SET, 0);
            });
            
            html.find('.'+namespace +'-unmute').bind('click', function() {
                //instead of sending 1 as the volume, a @todo: keep the value before the MUTE state and retrive it.
                self.getNotifications().fire(Events.VOLUME_SET, 1);
            });
            
            html.find('.'+namespace +'-volume-max').bind('click', function() {
                self.getNotifications().fire(Events.VOLUME_SET, 1);
            });
            
            return html;
        },
        
        
        /*
         *
         */
        mouseVolumeControl: function(e) {
            var mouseX = e.pageX,
                volumeObj = $('.groovy-volume'),
                volume = 0;
            
            switch(e.type) {
                case 'mousemove':
                case 'mouseleave':
                    break;
                
                case 'click': 
                    volume = (mouseX - (volumeObj.find('.groovy-volume-progress-bg').offset().left)) / (volumeObj.find('.groovy-volume-progress-bg').width());
                    this.getNotifications().fire(Events.VOLUME_SET, volume);
                    muted = false;
                    
                    break;
            }
        },
        
        
        /**
         *
         */
        setVolumeBar: function(volume) {
            var isMute = this._player._view.getController().isMute();
            
            // @todo: convert to percent instead of clear pixels width.
            this.el.find('.groovy-volume-bar-value').css({
                width: this.el.find('.groovy-volume-progress-bg').width() * volume
            });
            
            this._toggleIf(!isMute, this.el.find('.groovy-mute'));
            this._toggleIf(isMute, this.el.find('.groovy-unmute'));
            
            return this;
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this._player._view.getNotifications();
        },
    });
    
    return Volume;
});