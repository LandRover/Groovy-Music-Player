define([
    "events/events",
    "events/states",
    "utils/event",
    "utils/device",
    "utils/logger",
], function(Events, States, Event, Device, Logger) {
    /**
     * Channel
     * 
     * The channel object is responsible for actually playing the media
     * and extracting the spectrum data, as well as loading the media via XHR
     */
    var Channel = function(options) {
        $.extend(this, options); // extend options with this.
        
        this.init();
    };
    
    Channel.prototype = {
        item: null,
        parent: null,
        
        audioCtx: null,
        lasttime_inseconds: 0,
        audioBuffer: null,
        
        frequencyByteData: [],
        webAudioSource: null,
        javascriptNode: null,
        
        audioEl: null,
        loaded: false,
        playing: false,
        
        isReadyInterval: null,
        channelEndTriggered: false,
        
        
        /**
         * Constructor method, called during creation
         */
        init: function() {},
        
        
        /**
         * Stop the current audio element
         * 
         * Changes the state of the channel to not playing.
         */
        stop: function() {
            if (this.audioEl) {
                if ('function' === typeof(this.audioEl.pause)){
                    this.audioEl.pause();
                }
            }
            
            this.setPlaying(false);
        },
        
        
        /**
         * Pause the current channel
         *
         * @param {Object} pargs
         */
        pause: function(pargs) {
            var margs = {
                audioapi_setlasttime: true
            };
            
            if (pargs) {
                margs = $.extend(margs, pargs);
            }
            
            if (this.audioBuffer != null){
                //console.log(this.audioCtx.currentTime, audioBuffer.duration);
                //console.log(lasttime_inseconds);
                ///==== on safari we need to wait a little for the sound to load
                if (this.audioBuffer !== 'placeholder') {
                    if (margs.audioapi_setlasttime == true) {
                        this.lasttime_inseconds = this.audioCtx.currentTime;
                    }
                    //console.log('trebuie doar la pauza', this.lasttime_inseconds);
                    
                    this.webAudioSource.stop(0);
                    this.setPlaying(false);
                }
            } else {
                this.stop();
            }
        },
        
        
        /**
         * Play
         * Begins playing current channel, triggered extranlly - usually when the channel is added or crossfade started
         * 
         * @param {Number} time (second)
         */
        play: function(time) {
            time || (time = 0);
            
            this.setup();
            if (this.audioBuffer != null) {
                ///==== on safari we need to wait a little for the sound to load
                if (this.audioBuffer != 'placeholder') {
                    this.webAudioSource = this.audioCtx.createBufferSource();
                    this.webAudioSource.buffer = this.audioBuffer;
                    //this.javascriptNode.connect(this.audioCtx.destination);
                    this.webAudioSource.connect(this.audioCtx.destination);
        
                    this.webAudioSource.connect(this.analyser);
                    //this.analyser.connect(this.audioCtx.destination);
                    //console.log("play ctx", this.lasttime_inseconds);
                    this.webAudioSource.start(0, this.lasttime_inseconds);
                    
                    this.lasttime_inseconds = time;
                    this.audioCtx.currentTime = this.lasttime_inseconds;
                    //console.info(this.lasttime_inseconds);
                    this.pause({
                        audioapi_setlasttime: false
                    });
                 } else {
                    return;
                }
            } else {
                if (this.audioEl) {
                    if ('undefined' !== typeof(this.audioEl.play)) {
                        
                        if (true === Device.os.iOS) {
                            this.audioEl.play(); // attpemt to play for ios.
                        }
                        
                        try {
                            //alert(this.audioEl.seekable.length);
                            // ios fix
                            if (!this.audioEl.seekable || 'object' === typeof(this.audioEl.seekable) && 0 < this.audioEl.seekable.length) {
                                this.audioEl.currentTime = time;
                                this.audioEl.play();
                            } else {
                                throw 1;
                            }
                        } catch(e) {
                            this.isReadyInterval = setTimeout($.proxy(function() {
                                this.play(time);
                            }, this), 250);
                        }
                    }
                }
            }
            
            this.setPlaying(true);
        },
        
        
        /**
         * IsPlayed? The state of the player, for a basic check playing or not
         *
         * @return {Bool}
         */
        isPlaying: function() {
            return this.playing;
        },
        
        
        /**
         * Setter for changing the state of the channel. Called when pause/play called, used internally
         * only to keep track of the channel
         *
         * @param {Bool} state
         */
        setPlaying: function(state) {
            this.playing = state;
            this.parent._onStartedPlaying(); // @todo Figure this one out, when state false also firing event and causing a bug
        },
        
        
        /**
         * Seek to % is much better way of skipping to a specific second. Since the % is the same as the view %
         * When will be used again, will deteach the view from the information about the track length and % will be used instead.
         *
         * Will keep the view cleaner and better
         * @todo Start using this method instead of skip to second as an API to the VIEW SCRUBER
         */
        //seekToPercent: function(percent) {
        //    var totalTime = this.getActiveAudio().getDuration();
        //    return this.play(percent * totalTime);
        //},
        
        
        /**
         * Get the length of the track, extracted from the audio object
         *
         * @return {Number}
         */
        getDuration: function() {
            return this.audioEl.duration;
        },
        
        
        /**
         * Get current time of the track, in seconds, extracted from the audio object
         * 
         * @return {Number}
         */
        getCurrentTime: function() {
            return this.audioEl.currentTime;
        },
        
        
        /**
         * Loop is called from the controller (parent) of Channel.
         * Is responsible for tracking the time, and calculating the right moment to detect a crossfade feature
         */
        loop: function() {
            if ('undefined' === typeof(this.audioEl)) return;
            
            var timeTotal = this.getDuration(),
                timeCurr = this.getCurrentTime();
            
            //console.log(timeCurr, timeTotal);
            if (true === this.parent.isCrossfade()) {
                if (0 < timeTotal && timeCurr >= (timeTotal - this.parent._model.crossfade.onBeforeEnd)) {
                    if (true !== this.channelEndTriggered) {
                        console.log('CROSSFADE END TRIGGERED.', timeTotal);
                        this.channelEndTriggered = true;
                        this.parent._onEnd(true);
                    }
                }
            }
        },
        
        
        /**
         * loadSound by XHR used only for iphone igger loading the media
         * Audio element just failing to load properly via iPhones at the moment.
         *
         * @param {String} url
         */
        loadSound: function(url) {
            var request = new XMLHttpRequest();
            
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            
            // . . . step 3 code above this line, step 4 code below
            request.onload = $.proxy(function() {
                //console.info('sound load');
                this.audioCtx.decodeAudioData(request.response, $.proxy(function(buffer) {
                    this.audioBuffer = buffer;
                    
                    this.webAudioSource = this.audioCtx.createBufferSource();
                    this.webAudioSource.buffer = buffer;
                    
                    this.webAudioSource.connect(this.analyser);
                    this.analyser.connect(this.audioCtx.destination);
                    
                    // Start playing the buffer.
                    this.webAudioSource.connect(this.audioCtx.destination);
                    //this.webAudioSource.start(0);
                }, this), function() {
                    console.log('err loading..');
                });
            }, this);
            
            request.send();
        },
        
        
        /**
         * Sets up the channel
         * 
         * Creates the audio element, attaches the file and begins loading.
         */
        setup: function() {
            if (true === this.loaded) {
                return;
            }
            
            var self = this;
            var eventsList = {
                timeupdate: '',
                durationchange: '',
                play: '',
                playing: '',
                pause: '',
                waiting: '',
                seeking: '',
                seeked: '',
                volumechange: '',
                ratechange: '',
                suspend: '',
                
                ended: function(e) {
                    self.audioEl.currentTime = 0;
                    
                    if (true !== self.channelEndTriggered) {
                        self.parent._onEnd(false);
                        self.channelEndTriggered = false;
                    }
                }
            };
            
            this.audioEl = document.createElement('audio');
            this.audioEl.src = this.item._model.file;
            this.setVolume();
            
            _.each(eventsList, $.proxy(function(id, callback) {
                if ('function' === typeof(callback)) {
                    this.audioEl.addEventListener(id, callback, false);
                }
            }, this));
            
            this._initSpektrum();
            
            this.loaded = true;
            this.play();
        },
        
        
        /**
         * Init spektrum wires the parent context.
         *
         * (if Spektrum feature is used)
         */
        _initSpektrum: function() {
            var self = this;
            this.audioCtx = null;
            
            if (true === this.parent._model.spectrum.enabled) {
                this.audioCtx = this.parent.getCtx();
                
                if (this.audioCtx) {
                    if ('undefined' !== typeof(this.audioCtx.createJavaScriptNode)) {
                        this.javascriptNode = this.audioCtx.createJavaScriptNode(2048, 1, 1);
                    }
                    
                    if ('undefined' !== typeof(this.audioCtx.createScriptProcessor)) {
                        this.javascriptNode = this.audioCtx.createScriptProcessor(2048, 1, 1);
                    }
                    
                    if ('undefined' !== typeof(this.audioCtx.createScriptProcessor) || 'undefined' !== typeof(this.audioCtx.createScriptProcessor)) {
                        this.javascriptNode.connect(this.audioCtx.destination);
                        
                        // setup a analyzer
                        this.analyser = this.audioCtx.createAnalyser();
                        this.analyser.smoothingTimeConstant = 0.3;
                        this.analyser.fftSize = 512;
                        
                        // create a buffer source node
                        //Steps 4
                        //console.log('mmm');
                        
                        /*
                        if (Device.mobile() && (Device.browser.safari || isDevice.os.iOS)) {
                            this.loadSound(this.fileMeta.file);
                            this.audioBuffer = 'placeholder';
                        }
                        */
                        if (Device.browser.chrome || Device.browser.firefox) {
                            
                            this.webAudioSource = this.audioCtx.createMediaElementSource(this.audioEl);
                            this.webAudioSource.connect(this.analyser);
                            this.analyser.connect(this.audioCtx.destination);
                        }
                        
                        this.javascriptNode.onaudioprocess = $.proxy(function() {
                            // get the average for the first channel
                            var frequencyByteData = new Uint8Array(this.analyser.frequencyBinCount);
                            this.analyser.getByteFrequencyData(frequencyByteData);
                            
                            this.frequencyByteData = frequencyByteData;
                        }, this);
                    }
                }
            }
        },
        
        
        /**
         * Sets the volume on the current channel.
         *
         * Data is provided and stored on the parent (Controller)
         */
        setVolume: function() {
            var volume = this.parent.getVolume();
            
            this.audioEl.volume = volume;
        },
        
        
        /**
         * Destroy is called extranlly (usually) and responsible to treaing down the channel.
         *
         * Called when track is done playing and no longer needed.
         */
        destory: function() {
            this.stop();
            this.audioEl = null;
            
            delete this.audioEl;
        }
    };
    
    return Channel;
});