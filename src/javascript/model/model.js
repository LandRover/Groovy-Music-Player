define([
    "../core",
    "./base_model",
    "./media_model",
    "../events/states",
    "../utils/logger",
], function(gPlayer, BaseModel, MediaModel, States, Logger) {
    /**
     * gPlayer Model
     *
     * Stores the current state of the player. Holds the playlist data the the current active media state.
     */
    var Model = function(config) {
        this.init(config);
    };
    
    Model.prototype = _.extend({
        /**
         * Default config data
         */
        config: {
            classes: {
                gPlayer: 'gplayer',
                namespace: 'groovy',
                
                empty: 'empty',
                size: 'medium',
                draggable_queue: 'draggable-queue',
                
                //player stuff
                player: 'player',
                player_container: 'player-container',
                player_wrapper: 'player-wrapper',
                player_background: 'player-background',
                
                //queue
                playlist: 'playlist',
                queue: 'queue'
            },
            
            
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
         * @return this for chaining
         */
        init: function(config) {
            Logger.debug('MODEL::INIT FIRED');
            
            // external config data merge with defaults
            _.extend(this, this.config, config);
            
            this._mediaModel = new MediaModel();
            
            return this;
        },
        
        
        /**
         * Sets up the main model
         *
         * @param {DOMElement} container
         * @todo add merge with localStorage data to store user preferences locally
         * @return this for chaining
         */
        setup: function(container) {
            Logger.debug('MODEL::SETUP FIRED');
            
            this._container = container;
            
            return this;
        },
        
        
        /**
         *
         */
        getContainer: function() {
            return this._container;
        }
    }, new BaseModel);
    
    return Model;
});