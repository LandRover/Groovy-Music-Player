define([
    "../core",
    "./base_model",
    "./media_model",
    "../utils/logger",
], function(gPlayer, BaseModel, MediaModel, Logger) {
    /**
     * gPlayer Model
     *
     * Stores the current state of the player. Holds the playlist data the the current active media state.
     */
    var Model = function(config) {
        this.init(config);
    };
    
    Model.prototype = $.extend(true, {
        /**
         * Default config data
         */
        config: {
            // controls
            autoplay: false,
            controls: true,
            mute: false,
            
            // skin
            skin: 'grooveshark',
            
            // features
            crossfade: false,
            waveform: false,
            spectrum: false,
            
            // player settings
            state: States.IDLE,
            duration: -1,
            position: 0,
            volume: 100,
            buffer: 0,
            
            // queue sorting properties
            sortable: {
                distance: 30,
                tolerance: 'pointer',
                zIndex: 200
            },
            
            // collection
            playlist: []
        },
        
        
        /**
         * Current media model object, stores data for the current playing item.
         */
        _mediaModel: null,
        
        
        init: function(config) {
            Logger.info('MODEL::INIT FIRED');
            this._mediaModel = new MediaModel();
        },
        
        
        /**
         * Sets up the main model
         *
         * @param {Object} config
         * @todo add merge with localStorage data to store user preferences locally
         * @return this for chaining
         */
        setup: function(config) {
            Logger.info('MODEL::SETUP FIRED');
            
            // external config data merge with defaults
            $.extend(true, this.config, config);
            
            return this;
        }
    }, new BaseModel);
    
    return Model;
});