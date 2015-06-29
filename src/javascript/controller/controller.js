define([
    "controller/channel",
    "model/model",
    "view/view",
    "queue/queue",
    "events/events",
    "events/states",
    "utils/strings",
    "utils/event",
    "utils/logger",
], function(Channel, Model, View, Queue, Events, States, Strings, Event, Logger) {
    /**
     * gPlayer main controller
     *
     * Responsible for the general flow and creation of the view and models
     */
    var Controller = function(config) {
        this.init(config);
    };
    
    Controller.prototype = {
        /**
         * Referances
         */
        _view: null,
        _model: null,
        _queue: null,
        _notifications: null,
        
        _channels: [],
        _state: States.IDLE,
        
        audioCtx: null,
        mute: false,
        volume: 1,
        
        
        /**
         * Constructor function for the main controller
         *
         * Registering important instances to hold here
         *
         * @param {Object} config
         * @param {Object}
         * @return this for chaining
         */
        init: function(config) {
            Logger.debug('CONTROLLER::INIT FIRED');
            
            this._model = new Model(config);
            this._notifications = new Event();
            this._view = new View(this, this._notifications);
            this._queue = new Queue(this._notifications);
            
            this.subscribe();
            
            return this;
        },
        
        
        /**
         *
         */
        subscribe: function() {
            var self = this;
            
            this.getNotifications().on(Events.STATE_CHANGED, function(state) {
                self._state = state;
            });
            
            this.getNotifications().on(Events.PLAY, function(item) {
                console.log(['CONTROLLER::ITEM ARRIVED', item]);
                self.channelAdd(item);
                self.changeState(States.PLAYING);
            });
            
            this.getNotifications().on(Events.PAUSE, function() {
                self.changeState(States.PAUSED);
            });
            
            $(window).bind('resize', function() {
                self.getNotifications().fire(Events.RESIZE);
            });
            
            return this;
        },
        
        
        /**
         * Bootstraps the main controller
         */
        bootstrap: function(container) {
            this._model.setup(container);
            this._view.setup();
            this.loop();
        },
        
        
        /**
         * Getter for the Queue object, set on constructor
         */
        getQueue: function() {
            return this._queue;
        },
        
        
        /**
         * Getter for the Model object, set on constructor
         */
        getModel: function() {
            return this._model;
        },
        
        
        /**
         * Getter for the Notifications object, set on constructor
         */
        getNotifications: function() {
            return this._notifications;
        },
        
        
        /**
         * Changes the state of the player by boardcasting the proper event on change.
         * This is the only place modifies the state of the player
         * 
         * @param {String} newState (ENUM from States object)
         */
        changeState: function(newState) {
            if (newState === this._state) return;
            
            this.getNotifications().fire(Events.STATE_CHANGED, newState);
        },
        
        
        /**
         *
         */
        isPlaying: function() {
            for (var i = 0, len = this._channels.length; i < len; i++) {
                if ('undefined' !== typeof(this._channels[i]) && true === this._channels[i].isPlaying())
                    return true;
            }
        
            return false;
        },
        
        
        /**
         *
         */
        channelAdd: function (item) {
            var channelNew = new Channel({
                parent: this,
                item: item
            });
            
            this._channels.push(channelNew);
            channelNew.mediaPlay();
            
            return this;
        },
        
        
        /**
         *
         */
        getActiveChannel: function() {
            return this._channels[0]; //channel 0 is the active.. 1 is usually created only while crossfading and even then.. 0 is the active.
        },
        
        
        isCrossfade: function() {
            return this._model.crossfade.enabled;
        },
        
        
        isMute: function() {
            return this.mute;
        },
        
        /**
         *
         */
        getVolume: function() {
            return this.volume;
        },
        
        
        _onEnd: function(crossfade) {
            if (true === crossfade) {
                setTimeout($.proxy(function() {
                    this.activeChannelCleanup();
                }, this), this._model.crossfade.onBeforeEnd * 1000);
            } else {
                this.activeChannelCleanup();
            }
            
            //api.onEnd();
        },
        
        
        /**
         *
         */
        setVolume: function(volume) {
            this.volume = (1 <= volume) ? 1 : volume; // can not be greater than 1
            this.mute = (0 >= volume) ? true : false;
            
            //update view.
            this._view.getPlayerView().setVolumeBar();

            //updates the channel with volume value.
            for (var i = 0, len = this._channels.length; i < len; i++) {
                if ('undefined' !== typeof(this._channels[i]))
                    this._channels[i].setVolume();
            } 
            
            /*
            var interactiveObj = $('.groovy-interactive');
            interactiveObj.find('.groovy-scrubber').find('img').eq(0).css({
                transform: 'scaleY('+arg+')'
            });
            
            if(arg == 0){
                cthis.find('.scrub-bg-img-reflect').fadeOut('slow');
            } else {
                cthis.find('.scrub-bg-img-reflect').fadeIn('slow');
            }
            last_vol = arg;
            */
        },
        
        
        /**
         *
         */
        loop: function() {
            // verify everything needed for the loop exists. Run loop only when playing.
            if ('undefined' === typeof(this.getActiveChannel()) || !this.isPlaying()) {
                return this._runLoop();
            }
            
            var scrubberWidth = this._view.getPlayerView().getScrubberWidth(),
                currentTime = $('.groovy-current-time'),
                duration = $('.groovy-duration'),
                scrubberOffset = 0,
                scrubberOffsetPercent = 0,
                scrubberOffsetPixels = 0,
                timeTotal = this.getActiveAudio().duration,
                timeCurr = this.getActiveAudio().currentTime,
                timeOffset = 3;
            
            /*
            // might not work.. audiobuffer is per channel.. odd location for referances, check!.
            if (this.audioBuffer && 'placeholder' !== this.audioBuffer) {
                timeTotal = this.audioBuffer.duration;
                timeCurr = this.audioCtx.currentTime;
                //console.log(this.audioBuffer.currentTime);
            }*/
            
            scrubberOffset = ((timeCurr - this._model.style.interactiveSelectOffset) / timeTotal);
            scrubberOffsetPercent = scrubberOffset * 100;
            
            // console.log(_scrubbar.children('.scrub-prog'), scrubberOffsetPercent, timeTotal, '-timecurr ', timeCurr, scrubberWidth);
            if (null == this.audioBuffer) {
                $('body').find('.groovy-spectrum-progress').css({
                    width: scrubberOffsetPercent + '%'
                });
                
                $('body').find('.groovy-scrubber-progress').css({
                    width: scrubberOffsetPercent + '%'
                });
                
                $('body').find('.groovy-play-bar').css({
                    width: scrubberOffsetPercent + '%'
                });
            }

            if (true === this._model.spectrum.enabled)
                this.drawSpectrum();
            
            if (true === this._model.timerDynamic) {
                scrubberOffsetPixels = scrubberOffset * scrubberWidth;
                
                currentTime.css({
                    left: scrubberOffsetPercent + '%'
                });
                
                if (scrubberOffsetPixels > scrubberWidth - 30) {
                    currentTime.css({
                        opacity: 1 - (((scrubberOffsetPixels - (scrubberWidth - 30)) / 30))
                    });
                } else {
                    if (1 !== Number(currentTime.css('opacity'))) {
                        currentTime.css({
                            opacity: 1
                        });
                    }
                };
            };
            
            //console.info(_currTime, timeCurr, this.formatTime(timeCurr))
            currentTime.text(new Strings(timeCurr).formatTime());
            duration.text(new Strings(timeTotal).formatTime());
            
            // notify channel
            for (var i = 0, len = this._channels.length; i < len; i++) {
                if ('undefined' !== typeof(this._channels[i])) {
                    this._channels[i].loop();
                } else {
                    console.log(['DEBUG', this._channels, i]);
                }
            }
            
            this._runLoop();
        },
        
        
        /**
         *
         */
        _runLoop: function() {
            requestAnimFrame($.proxy(function() {
                this.loop();
            }, this));
            
            return this;
        },
        
        
        /**
         *
         */
        activeChannelCleanup: function() {
            if ('undefined' !== typeof(this.getActiveChannel())) {
                this.getActiveChannel().destory();
                console.log(this._channels);
                this._channels.shift();
            }

            return this;
        },
        
        
        /**
         *
         */
        pause: function() {
            this.activeChannelCleanup();
            
            return this;
        },
        
        
        /**
         *
         */
        getCtx: function() {
            if (null === this.audioCtx) {
                this.audioCtx = new window.AudioContext;
            }
            
            return this.audioCtx;
        },
        
        
        /**
         * Based on a Fiddle I wrote: http://jsfiddle.net/Fc8Jr/
        **/
        drawSpectrum: function() {
            var frequencyByteData = this.getActiveChannel().frequencyByteData,
                canvas = this._view.getPlayerView().getCanvasReferances();
            
            var width = canvas.el.active.background.width,
                height = canvas.el.active.background.height;
            
            var BAR_WIDTH = 3,
                SPACER_WIDTH = 1;
            
            /* test.. disabled.
            var gradient = canvas.context.active.background.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(1,'#000000');
            gradient.addColorStop(0.75,'#ff0000');
            gradient.addColorStop(0.25,'#ffff00');
            gradient.addColorStop(0,'#ffffff');
            */
            
            //canvas.el.active.background.width = width;
            canvas.context.active.background.clearRect(0, 0, width, height);
            canvas.context.active.background.fillStyle = '#'+ this._model.spectrum.color.bg;
            
            canvas.context.active.progress.clearRect(0, 0, width, height);
            canvas.context.active.progress.fillStyle = '#'+ this._model.spectrum.color.progress;

            for (var i = 0, magnitude = 0, len = frequencyByteData.length; i < len; i++) {
                magnitude = Math.ceil(frequencyByteData[i] * height / 256);
                if (2 > magnitude) magnitude = 2;
                
                canvas.context.active.background.fillRect(i * (SPACER_WIDTH + BAR_WIDTH), height, BAR_WIDTH, -magnitude);
                canvas.context.active.progress.fillRect(i * (SPACER_WIDTH + BAR_WIDTH), height, BAR_WIDTH, -magnitude);
                
                //canvas.context.active.background.fillRect(i/256 * width, height, width/len, -magnitude);
                //canvas.context.active.progress.fillRect(i/256 * width, height, width/len, -magnitude);
            }
            
            if (true === this._model.reflection) {
                canvas.context.reflect.background.clearRect(0, 0, width, height);
                canvas.context.reflect.background.drawImage(canvas.el.active.background, 0, 0);
                
                canvas.context.reflect.progress.clearRect(0, 0, width, height);
                canvas.context.reflect.progress.drawImage(canvas.el.active.progress, 0, 0);
            }
        },
        
        
        /**
         *
         */
        startedPlaying: function() {
            console.log('CONTROLLER::startedPlaying fired -- oh well.. started, not sure i want to keep this');
        },
        
        
        /**
         *
         */
        getActiveAudio: function() {
            return this.getActiveChannel().audioEl;
        }
    };
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, el) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    
    return Controller;
});