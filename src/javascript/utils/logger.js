define([], function() {
    /**
     * Basic Logger
     * 
     * Centralized access for the console.log method.
     * Wrapps around few method of Console to allow clean and unified API to log errors.
     *
     * @todo Consider XHR calls to log errors on server.
     * @todo Hook to the debug mode, controlled via configuration of the object.
     */
    var Logger = {
        /**
         * Fatal errors. Mission critial - application can not run when present.
         * @param {mixed} log
         */
        error: function(log) {
            return this._log('error', log);
        },
        
        
        /**
         * Warnning only. Should be fixed but application been able to recover.
         * @param {mixed} log
         */
        warn: function(log) {
            return this._log('warn', log);
        },
        
        
        /**
         * Information only. General info printed.
         * @param {mixed} log
         */
        info: function(log) {
            return this._log('info', log);
        },
        
        
        /**
         * Debug mode. Print as much as possible to allow quick and easy
         * debugging when needed.
         */
        debug: function(log) {
            return this._log('debug', log);
        },
        
        
        /**
         * Private method, provides single point of access to the console.log API.
         * prevents mess around the code and a clean way to prevent the output of the log
         * or the sevirity level.
         *
         * @param {string} sevirity
         * @param mixed log
         * @todo consider stacking the log calls, not so important but might be useful for debugging
         * @todo display on debug mode only - currently the whole mode is debug.
         */
        _log: function(sevirity, log) {
            if ('undefined' !== typeof(console) && 'undefined' !== typeof(console[sevirity])) {
                console[sevirity]([sevirity, log]);
            }
        }
    };
    
    return Logger;
});