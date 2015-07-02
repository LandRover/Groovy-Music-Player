define([
    "events/events",
    "events/states",
    "utils/event",
    "utils/device",
    "utils/logger",
], function(Events, States, Event, Device, Logger) {
    /**
     *
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
        loaded: false,
        playing: false,
        audioEl: undefined,
        isReadyInterval: null,
        channelEndTriggered: false,
        
        
        /**
         *
         */
        init: function() {
            console.log(this.item);
        },
        
        
        /**
         *
         */
        mediaStop: function() {
            if (this.audioEl) {
                if (this.audioEl.pause != undefined){
                    this.audioEl.pause();
                }
            }
            
            this.setPlaying(false);
        },
        
        
        /**
         *
         */
        mediaPause: function(pargs) {
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
                this.mediaStop();
            }
        },
        
        
        /**
         *
         */
        mediaPlay: function(time) {
            time || (time = 0);
            
            this._mediaSetup();
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
                    this.mediaPause({
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
                                this.mediaPlay(time);
                            }, this), 250);
                        }
                    }
                }
            }
            
            this.setPlaying(true);
        },
        
        
        /*
         *
         */
        isPlaying: function() {
            return this.playing;
        },
        
        
        /**
         *
         */
        setPlaying: function(isPlaying) {
            this.playing = isPlaying;
            this.parent._onStartedPlaying();
            
            return this;
        },
        
        /*
        seekToPercent: function(percent) {
            var totalTime = this.getActiveAudio().duration;
            return this.mediaPlay(percent * totalTime);
        },
        */
        
        
        /**
         *
         */
        getDuration: function() {
            return this.audioEl.duration;
        },
        
        
        /**
         *
         */
        getCurrentTime: function() {
            return this.audioEl.currentTime;
        },
        
        
        /**
         *
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
        
        
        //xhr used only for iphone igger loading.
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
         *
         */
        _initLoaded: function() {
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
                        //Steps 3 and 4
                        //console.log('hmm');
                        
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
            
            this.loaded = true;
            this.mediaPlay();
        },
        
        
        /*
         *
         */
        _mediaSetup: function() {
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
            
            this._initLoaded();
        },
        
        
        /**
         *
         */
        setVolume: function() {
            var volume = this.parent.getVolume();
            
            this.audioEl.volume = volume;
            
            return this;
        },
        
        
        /**
         *
         */
        destory: function() {
            this.mediaStop();
            this.audioEl = null;
            
            delete this.audioEl;
        }
    };
    
    return Channel;
});