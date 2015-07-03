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
     * as well as all the events related to the actual wiring of the player logic and channel management.
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
         * Subscribe to interesting actions during creation
         * Called during construction
         */
        subscribe: function() {
            this.getNotifications().on(Events.STATE_CHANGED, function(state) {
                this._state = state;
            }, this);
            
            this.getNotifications().on(Events.PLAY, function(item) {
                console.log(['CONTROLLER::ITEM ARRIVED', item]);
                this.pause();
                
                this.channelAdd(item)
                    .play();
                
                this.changeState(States.PLAYING);
            }, this);
            
            this.getNotifications().on(Events.PAUSE, function() {
                this.changeState(States.PAUSED);
                this.pause();
            }, this);
            
            this.getNotifications().on(Events.QUEUE_EMPTY, function() {
                this.changeState(States.IDLE);
                this.pause();
            }, this);
            
            // translate native event for resize, for internal event
            $(window).bind('resize', function() {
                this.getNotifications().fire(Events.RESIZE);
            });
            
            this.getNotifications().on(Events.VOLUME_SET, function(volume) {
                this.setVolume(volume);
            }, this);
            
            this.getNotifications().on(Events.JUMP_TO_SECOND, function(second) {
                this.getActiveChannel().play(second);
            }, this);
        },
        
        
        /**
         * Bootstraps the main controller, setups objects and beings the animation loop.
         * 
         * @param {HTMLElement} container
         */
        bootstrap: function(container) {
            this._model.setup(container);
            this._view.setup();
            this.loop();
        },
        
        
        /**
         * Getter for the Queue object, set on constructor
         *
         * @return {Object} Queue instance
         */
        getQueue: function() {
            return this._queue;
        },
        
        
        /**
         * Getter for the Model object, set on constructor
         *
         * @return {Object} Model instance
         */
        getModel: function() {
            return this._model;
        },
        
        
        /**
         * Getter for the Notifications object, set on constructor
         *
         * @return {Object} Notifications instance
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
            // verify state is diffrent to avoid setting the same state
            if (newState === this._state) return;
            
            this.getNotifications().fire(Events.STATE_CHANGED, newState);
        },
        
        
        /**
         * Playing? Returns by checking each indevidual channel to prevent errors.
         * This is a protective check, rather than player state based.
         *
         * Can be used to check the real state of the player regardless the state, might be helpful for debuging issues
         *
         * @return {Bool}
         */
        isPlaying: function() {
            for (var i = 0, len = this._channels.length; i < len; i++) {
                if ('undefined' !== typeof(this._channels[i]) && true === this._channels[i].isPlaying())
                    return true;
            }
            
            return false;
        },
        
        
        /**
         * Adds new channel, called when song is changed or started.
         * Stacks the instances of the channels in an array.
         * Each channel is indevidual and can be played more than 1 at once. The current only
         * state more than once channel is playing is during crossfading but more features may come, like mixin etc.
         *
         * @param {Object} item
         * @return {Object} channel instance
         */
        channelAdd: function (item) {
            var channelNew = new Channel({
                parent: this,
                item: item
            });
            
            this._channels.push(channelNew);
            
            return channelNew;
        },
        
        
        /**
         * Getter for the current active audio channel.
         * Fetched from the array of all channels. Channel 0 is the active..
         * Channel 1 is usually created only while crossfading and even then.. 0 is the active during the current usecases.
         *
         * Logic also can be changed later depending on features
         *
         * @return {Object} active channel instance
         */
        getActiveChannel: function() {
            return this._channels[0];
        },
        
        
        /**
         * Getter for the active Audio element instance
         */
        getActiveAudio: function() {
            return this.getActiveChannel().audioEl;
        },
        
        
        /**
         * onEnd is fired by one of the channels when it reaches the end of the track
         * or crossfade onBeforeEnd time triggered.
         *
         * @todo Wire by 2 events, for crossfade and regular ITEM_END. Drop the direct function call from channel to _onEnd
         * @param {Bool} crossfade
         */
        _onEnd: function(crossfade) {
            if (true === crossfade) {
                setTimeout($.proxy(function() {
                    this.activeChannelCleanup();
                }, this), this._model.crossfade.onBeforeEnd * 1000);
            } else {
                this.activeChannelCleanup();
            }
            
            this.getNotifications().fire(Events.PLAY_NEXT);
            //api.onEnd();
        },
        
        
        /**
         * Is player muted, or volume = 0
         * 
         * @return {Bool}
         */
        isMute: function() {
            return this.mute;
        },
        
        
        /**
         * Is crossfade feature enabled?
         *
         * @return {Bool}
         */
        isCrossfade: function() {
            return this._model.crossfade.enabled;
        },
        
        
        /**
         * Getter for the volume
         * Volume ranges from 0 to 1
         *
         * @return {Number} volume
         */
        getVolume: function() {
            return this.volume;
        },
        
        
        /**
         * Sets the volume and updates all channels
         *
         * @param {Number} volume - ranges from 0 to 1 only.
         */
        setVolume: function(volume) {
            this.volume = (1 <= volume) ? 1 : volume; // can not be greater than 1
            this.mute = (0 >= volume) ? true : false;
            
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
         * Loop for tracking the audio and moving progress of the UI.
         * @todo Split into smaller chunks
         * @todo Move from here, not really related.
         */
        loop: function() {
            // verify everything needed for the loop exists. Run loop only when playing.
            if ('undefined' === typeof(this.getActiveChannel()) || !this.isPlaying()) {
                return this._runLoop();
            }
            
            var scrubberWidth = this._view.getPlayerView().components.interactive.getWidth(),
                currentTime = $('.groovy-current-time'),
                duration = $('.groovy-duration'),
                scrubberOffset = 0,
                scrubberOffsetPercent = 0,
                scrubberOffsetPixels = 0,
                timeTotal = this.getActiveChannel().getDuration(),
                timeCurr = this.getActiveChannel().getCurrentTime(),
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
         * Animation tick, keep track of the main loop via requestAnimFrame (optimial)
         */
        _runLoop: function() {
            window.requestAnimFrame($.proxy(function() {
                this.loop();
            }, this));
        },
        
        
        /**
         * Cleans up the current channel when track ends, or paused.
         * Shifts the array, removing the current active and progressing the crossfaded track to the 0 position in the array
         */
        activeChannelCleanup: function() {
            if ('undefined' !== typeof(this.getActiveChannel())) {
                this.getActiveChannel().destory();
                console.log(this._channels);
                this._channels.shift();
            }
        },
        
        
        /**
         * Pauses the current track by destroying the channel.
         *
         * @todo Fix the pause, it's acting like STOP rather than pause - doesnt keep the position in the track
         */
        pause: function() {
            this.activeChannelCleanup();
            
            return this;
        },
        
        
        /**
         * Lazy getter for AudioContext
         * Keeps track of 1 audio context and used by all the channels.
         *
         * @return {Object} AudioContext singleton
         */
        getCtx: function() {
            if (null === this.audioCtx) {
                // normalize AudioContext, if not supported binds webkit
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                
                this.audioCtx = new window.AudioContext;
            }
            
            return this.audioCtx;
        },
        
        
        /**
         * Spectrum rendering
         * Called from the animation loop and draws nice spektrum of the audio.
         * 
         * @see http://jsfiddle.net/delz/yy01kxen/ - Based on a jsFiddle I wrote
         * @todo Move from here, not the best place to be here.. a lot of view related stuff
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
         * On started playing event is fired from the channel, when the item is actually began playing.
         *
         * @todo Figure out what to do with this, maybe consider removing or changing
         *       the state of the player.. event is also an option
         */
        _onStartedPlaying: function() {
            console.log('CONTROLLER::_onStartedPlaying fired');
        }
    };
    
    /**
     * Normalizes the request animation frame method, depending on env. Based on webAPI
     * Optimized and replaces the timer loop, should be used for all the loops
     * 
     * @todo move from here, to more global point, not directly related to this Controller.
     * @return {Function} ticker
     */
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