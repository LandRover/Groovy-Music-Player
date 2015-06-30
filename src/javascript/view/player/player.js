define([
    "view/base_view",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/player.html",
], function(BaseView, Events, States, Logger, playerHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var Player = function(view) {
        Logger.debug('PLAYER::CONSTRUCTOR FIRED');
        
        this._view = view;
        
        this.init();
    };
    
    
    Player.prototype = _.extend(new BaseView(), {
        _view: null,
        _state: States.IDLE,
        canvasReferances: null,
        
        
        /**
         *
         */
        init: function() {
            this.subscribe();
        },
        
        
        /**
         * Called during construction, subscribe to Events that interest the Player
         */
        subscribe: function() {
            var self = this;
            
            this.getNotifications().on(Events.STATE_CHANGED, function(state) {
                self._state = state;
                self.playPauseButtonToggle();
            });
            
            this.getNotifications().on(Events.PLAY, function(item) {
                self.setMediaProperties(item);
            });
            
            this.getNotifications().on([Events.RESIZE, Events.QUEUE_EMPTY_NOT], function() {
                self.resizeComponents();
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
            
            this.output = this.bindActions($(_.template(playerHTML)(
                self._view.getModel().classes
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
                namespace = this._view.getModel().classes.namespace,
                el = {
                    interactive: $(html).find('.groovy-interactive'),
                    volume: $(html).find('.groovy-volume'),
                    options: $(html).find('.groovy-options')
                },
                notify = {
                    scrubber: function(e) {
                        self.mouseScrubbar(e);
                    },
                    
                    volume: function(e) {
                        self.mouseVolumeControl(e);
                    },
                    
                    mute: function(e) {
                        self._view.getController().setVolume(0);
                    },
                    
                    unmute: function(e) {
                        //instead of sending 1 as the volume, a @todo: keep the value before the MUTE state and retrive it.
                        self._view.getController().setVolume(1);
                    },
                    
                    shuffle: function(e) {
                        self.toggleShuffle();
                    },
                    
                    repeat: function(e) {
                        self.toggleRepeat();
                    },
                    
                    crossfade: function(e) {
                        self.toggleCrossfade();
                    }
                };
            
            $(html).find('.'+namespace +'-play').on('click', function() {
                self.getNotifications().fire(Events.QUEUE_PLAY_ACTIVE);
            });
            
            $(html).find('.'+namespace +'-pause').on('click', function() {
                self.getNotifications().fire(Events.PAUSE);
            });
            
            $(html).find('.'+namespace +'-previous').on('click', function() {
                self.getNotifications().fire(Events.PLAY_PREVIOUS);
            });
            
            $(html).find('.'+namespace +'-next').on('click', function() {
                self.getNotifications().fire(Events.PLAY_NEXT);
            });
            
            el.interactive.bind('mousemove', notify.scrubber);
            el.interactive.bind('mouseleave', notify.scrubber);
            el.interactive.bind('click', notify.scrubber);
            
            el.volume.find('.'+namespace +'-volume-progress-bg').bind('click', notify.volume);
            el.volume.find('.'+namespace +'-mute').bind('click', notify.mute);
            el.volume.find('.'+namespace +'-unmute').bind('click', notify.unmute);
            el.volume.find('.'+namespace +'-volume-max').bind('click', notify.unmute);
            
            el.options.find('.'+namespace +'-shuffle').bind('click', notify.shuffle);
            el.options.find('.'+namespace +'-repeat').bind('click', notify.repeat);
            el.options.find('.'+namespace +'-crossfade').bind('click', notify.crossfade);
            
            return html;
        },
        
        
        /**
         * Changes the view of the Play/Pause buttons according to the state of the player
         * Called when state is changed to adjust the view.
         *
         * @return this
         */
        playPauseButtonToggle: function() {
            var namespace = this._view.getModel().classes.namespace;
            
            this._toggleIf(!this.isPlaying(), $('.'+ namespace +'-play'));
            this._toggleIf(this.isPlaying(), $('.'+ namespace +'-pause'));
            
            return this;
        },
        
        
        shuffleStateToggle: function() {
            var isShuffle = this.isShuffle(),
                el = $('.groovy-shuffle');
            
            el.removeClass('active');
            if (true === isShuffle)
                el.addClass('active');
        },
        
        
        repeatStateToggle: function() {
            var isRepeat = this.isRepeat(),
                el = $('.groovy-repeat');
            
            el.removeClass('active');
            if (true === isRepeat)
                el.addClass('active');

            return this;
        },
        
        
        crossfadeStateToggle: function() {
            var isCrossfade = this.isCrossfade(),
                el = $('.groovy-crossfade');
            
            el.removeClass('active');
            if (true === isCrossfade)
                el.addClass('active');
            
            return this;
        },
        
        
        toggleRepeat: function() {
            this._view.getModel().repeat.enabled = !this.isRepeat();
            this.repeatStateToggle();
            //api.onRepeat(this.isRepeat());
            
            return this;
        },
        
        
        toggleShuffle: function() {
            this._view.getModel().shuffle.enabled = !this.isShuffle();
            this.shuffleStateToggle();
            //api.onShuffle(this.isShuffle());
            
            return this;
        },
        
        
        toggleCrossfade: function() {
            this._view.getModel().crossfade.enabled = !this.isCrossfade();
            this.crossfadeStateToggle();
            //api.onCrossfade(this.isCrossfade());
            
            return this;
        },
        
        
        isRepeat: function() {
            return this._view.getModel().repeat.enabled;
        },
        
        
        isShuffle: function() {
            return this._view.getModel().shuffle.enabled;
        },
        
        
        isCrossfade: function() {
            return this._view.getModel().crossfade.enabled;
        },
        
        
        /**
         * Updates the view UI with Item's data such as artist, song and thumbnail
         * 
         * @param {Object} Item Object
         * @return {Object} this aka. Player instance
         */
        setMediaProperties: function(item) {
            var namespace = this._view.getModel().classes.namespace,
                model = item._model;
            
            $('.'+ namespace +'-song-artist').html($(model.artist));
            $('.'+ namespace +'-song-name').html(model.song);
            $('.'+ namespace +'-thumbnail img').attr({src: model.thumbnail});
            
            // scrub
            $('.'+ namespace +'-scrubber-bg img').attr({src: model.scrub.bg});
           	$('.'+ namespace +'-scrubber-progress img').attr({src: model.scrub.progress});
            
            return this;
        },
        
        
        /**
         * Resize Components is called when a resize event is fired. Adjusting the Player ClassName according to the
         * size that most appropriate allowing CSS to alter the view
         */
        resizeComponents: function() {
            var model = this._view.getModel();
            var namespace = model.classes.namespace;
            var width = this.getWidth(),
                className = namespace +'-gui',
                elSize = '';
            
            // toggle view based on options.
            //this._toggleIf(model.waveform || model.spectrum, $('.groovy-interactive'));
            
            // toggle features based on condition
            // @todo move toggles to a proper location.. else where, where it handdles all the other stuff related to these buttons
            this._toggleIf(model.waveform.enabled, $('.groovy-scrubber'));
            this._toggleIf(model.spectrum.enabled, $('.groovy-spectrum'));
            
            if (900 <= width) {
                elSize += namespace + '-size-lg';
            } else
            if (700 <= width) {
                elSize += namespace + '-size-md';
            } else
            if (600 <= width) {
                elSize += namespace + '-size-sm';
            } else
            if (400 <= width) {
                elSize += namespace + '-size-xs';
            } else {
                elSize += namespace + '-size-xxs';
            }
            
            //set the class property on the player to allow CSS alter the view
            $('.'+className).attr({'class': className + ' ' + elSize});
            
            this.setDynamicElementsWidth(elSize); // @todo figure out.. move else where
        },
        
        
        getStaticElementsWidth: function() {
            var els = $('ul.groovy-skin').children(':visible').not('.groovy-calc-ignore'),
                width = 0;
            
            els.each(function(idx, el) {
                width += $(el).outerWidth(true);
            });
            
            return width;
        },
        
        
        /**
         *
         */
        setDynamicElementsWidth: function(elSize) {
            var model = this._view.getModel();
            var namespace = model.classes.namespace;
            var staticWidth = this.getStaticElementsWidth(),
                width = this.getWidth(),
                ratio = model.style.interactiveRatio,
                availableWidth = 0,
                dimenstions = {},
                canvas = this.getCanvasReferances().el,
                minimalInfoProgressBarOffset = 80,
                progressBarSaftyOffset = 3;
            
            availableWidth = width - staticWidth;
            
            dimenstions = {
                info: availableWidth - this.getWidthMargin('li.groovy-info') - progressBarSaftyOffset,
                interactive: availableWidth * (1 - ratio) - progressBarSaftyOffset,
                infoMinimal: availableWidth * ratio - this.getWidthMargin('li.groovy-info-minimal'),
            };
            
            // xss small, diffrent layout option.
            if (namespace + '-size-xxs' === elSize) {
                dimenstions.infoMinimal = availableWidth - this.getWidthMargin('li.groovy-info-minimal');
            }
            
            // info elemnt dynamic sizing.
            $('li.groovy-info').width(dimenstions.info);
            $('li.groovy-info div.groovy-progress-bar').width(dimenstions.info - minimalInfoProgressBarOffset);
            $('.groovy-scrabber').width(dimenstions.interactive);
            
            if (null !== canvas) {
                canvas.active.background.width = dimenstions.interactive;
                canvas.active.progress.width = dimenstions.interactive;
                
                canvas.reflect.background.width = dimenstions.interactive;
                canvas.reflect.progress.width = dimenstions.interactive;
            }
            
            $('li.groovy-info-minimal').width(dimenstions.infoMinimal);
            
            return this;
        },
        
        setVolumeBar: function() {
            var volumeObj = $('.groovy-volume'),
                volume = this._view.getController().getVolume(),
                isMute = this._view.getController().isMute();
            
            // @todo: convert to percent instead of clear pixels width.
            volumeObj.find('.groovy-volume-bar-value').css({
                width: volumeObj.find('.groovy-volume-progress-bg').width() * volume
            });
            
            this._toggleIf(!isMute, $('.groovy-mute'));
            this._toggleIf(isMute, $('.groovy-unmute'));
            
            return this;
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
                    this._view.getController().setVolume(volume);
                    muted = false;
                    
                    break;
            }
        },
        
        
        /**
         *
         */
        mouseScrubbar: function(e) {
            var mouseX = e.pageX,
                interactiveObj = $('.groovy-interactive'),
                scrubberWidth = this.getScrubberWidth(),
                channel = this._view.getController().getActiveChannel();
            
            switch(e.type) {
                case 'mousemove':
                    interactiveObj.children('.groovy-scrubber-hover').css({
                        left: (mouseX - interactiveObj.offset().left)
                    });
                    
                    break;
                
                case 'click': 
                    var timeTotal = channel.audioEl.duration;
                    var position = ((e.pageX - (interactiveObj.offset().left)) / scrubberWidth * timeTotal);
                    channel.mediaPlay(position);
                    
                    // @todo figure this one out, could be a bug.. if isPlaying is false.. wont jump to the proper position.
                    if (true !== this.isPlaying()) {
                        channel.mediaPlay();
                    }
                    
                    break;
            }
        },
        
        
        getCanvasReferances: function() {
            if (null !== this.canvasReferances) return this.canvasReferances;
            
            this.canvasReferances = {
                el: {
                    active: {
                        background: $('.spectrum-scrub-bg').get(0),
                        progress: $('.spectrum-scrub-prog').get(0)
                    },
                    
                    reflect: {
                        background: $('.spectrum-scrub-bg-reflect').get(0),
                        progress: $('.spectrum-scrub-prog-reflect').get(0)
                    }
                }
            };
            
            this.canvasReferances.context = {
                active: {
                    background: this.canvasReferances.el.active.background.getContext('2d'),
                    progress: this.canvasReferances.el.active.progress.getContext('2d')
                },
                
                reflect: {
                    background: this.canvasReferances.el.reflect.background.getContext('2d'),
                    progress: this.canvasReferances.el.reflect.progress.getContext('2d')
                }
            };
            
            return this.canvasReferances;
        },
        
        
        /**
         *
         */
        getScrubberWidth: function() {
            return $('.groovy-interactive').width();
        },
        
        
        /**
         *
         */
        getScrubberWidthMinimal: function() {
            return $('.groovy-seek-bar').width();
        },
        
        
        /**
         * Calculates the actual player width
         *
         * @return {Number}
         */
        getWidth: function() {
            return $(this._view.getModel().getContainer()).find('.'+ this._view.getModel().classes.player_wrapper).width();
        },
        
        
        /**
         * Is currently playing, based on states
         *
         * @return {Bool}
         */
        isPlaying: function() {
            return (States.PLAYING === this._state);
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this._view.getNotifications();
        },
        
        
        /**
         * Fired after the el added to the DOM, called by the BaseView
         */
        onAppend: function() {
            this.resizeComponents();
        }
    });
    
    return Player;
});