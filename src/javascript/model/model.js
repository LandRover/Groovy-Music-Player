define([
    "../core",
    "../base_model",
], function(gPlayer, BaseModel) {
    
    /**
     * gPlayer Model
     *
     * Stores the current state of the player. Holds the playlist data the the current active media state
     */
    var Model = $.extend(true, BaseModel, {
        /**
         * Default config data
         */
        config: {
            autoplay: false,
            controls: true,
            mute: false,
            volume: 100,
            skin: 'grooveshark',
            playlist: [], // collection
            state: States.IDLE,
            waveform: false,
            spectrum: false,
            duration: -1,
            position: 0,
            buffer: 0
        },
        
        
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