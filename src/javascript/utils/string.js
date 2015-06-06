define([
    "../core",
], function(gPlayer) {
    /**
     * Basic String
     * 
     * Enables chaning events, output must be called, else will return a chain
     */
    var String = function(string) {
        this.string = string; // store the original string, for any case
        this.set(string);
    };
    
    
    String.prototype = {
        string: '', // inital string
        outputString: '', // manipulated string
        
        
        /**
         * Trim is removing white spaces from the beginning and then end
         *
         * @return {string}
         */
        trim: function() {
            return this.set(this.output().replace(/^\s+|\s+$/g, ''));
        },
        
        
        /**
         * Result string, called externally to get the current result. After chains are complete.
         *
         * @return {string}
         */
        output: function() {
            return this.outputString;
        },
        
        
        /**
         * Store the output value to be manipulated or returned.
         * 
         * @param {string} string
         * @return {object} this String
         */
        set: function(string) {
            this.outputString = string;
            
            return this;
        }
    };
    
    return String;
});