define(function() {
    /**
     * Basic String
     * 
     * Enables chaning events, output must be called, else will return a chain
     */
    var Strings = function(string) {
        this.string = string; // store the original string, for any case
    };
    
    Strings.prototype = {
        string: '', // inital string
        
        
        /**
         * Converts seconds input to string structure format like 00:10
         * 
         * @return {String}
         */
        formatTime: function() {
            //formats the time
            var s = Math.round(this.string),
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
            return this.string.replace(/^\s+|\s+$/g, '');
        }
        
        
    };
    
    return Strings;
});