define([
    "../core",
    "./base_model",
    "./media_model",
], function(gPlayer, BaseModel, MediaModel) {
    /**
     * gPlayer Model
     *
     * Stores the current state of the player. Holds the playlist data the the current active media state.
     */
    var Model = $.extend(true, BaseModel, {
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
            
            // collection
            playlist: []
        },
        
        
        /**
         * Current media model object, stores data for the current playing item.
         */
        mediaModel: new MediaModel(),
        
        
        /**
         * Sets up the main model
         *
         * @param {Object} config
         * @todo add merge with localStorage data to store user preferences locally
         * @return this for chaining
         */
        setup: function(config) {
            // external config data merge with defaults
            $.extend(true, this.config, config);
            
            return this;
        }
    });
    
    return Model;
});