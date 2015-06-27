define(function() {
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
         *
         *
         */
        formatTime: function(time) {
            //formats the time
            var s = Math.round(time),
                m = 0;
            
            if (0 < s) {
                while (59 < s) {
                    m++;
                    s -= 60;
                }
                
                return String((10 > m ? '0' : '') + m + ':' + (10 > s ? '0' : '') + s);
            }
            
            return '00:00';
        },
        
        
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