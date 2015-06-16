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
        
        
        /**
         * Main gPlayer container object selector.
         */
        _container: null,
        
        
        /**
         * Constructor method, called when object is created.
         *
         * @param {Object} config
         * @param {HTMLDom} container
         * @return this for chaining
         */
        init: function(config, container) {
            Logger.debug('MODEL::INIT FIRED');
            
            // external config data merge with defaults
            $.extend(true, this, this.config, config);
            
            this._container = container;
            this._mediaModel = new MediaModel();
            
            return this;
        },
        
        
        /**
         * Sets up the main model
         *
         * @param {Object} config
         * @todo add merge with localStorage data to store user preferences locally
         * @return this for chaining
         */
        setup: function(config) {
            Logger.debug('MODEL::SETUP FIRED');
            
            return this;
        }
    }, new BaseModel);
    
    return Model;
});