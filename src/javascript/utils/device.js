define(function() {
    /**
     * Device detection util
     *
     * Helper for getting data regarding the current device such as os, browser touch ability etc.
     * Most of the elements are pre-processed and are not functions and can be accessed directly
     *
     * Object is a singleton
     */
    var Device = {
        /**
         * Is touch enabled on this device?
         * 
         * @return {Bool}
         */
        isTouch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        
        /**
         * OS detection. Currently supports iOS and Android
         * 
         * @return {Bool}
         */
        os: {
            iOS: (/iP(hone|od|ad)/i).test(navigator.userAgent.toLowerCase()),
            android: (/android/i).test(navigator.userAgent.toLowerCase())
        },
        
        
        /**
         * Browser detection, for all the major browser. A quick way to know the context
         * 
         * @return {Bool}
         */
        browser: {
            firefox: (/firefox/i).test(navigator.userAgent.toLowerCase()),
            chrome: (/chrome/i).test(navigator.userAgent.toLowerCase())  && (/google/i).test(navigator.vendor.toLowerCase()),
            safari: (/safari/i).test(navigator.userAgent.toLowerCase()) && (/apple/i).test(navigator.vendor.toLowerCase()),
            opera: (/opera/i).test(navigator.userAgent.toLowerCase()),
        },
        
        
        /**
         * Is mobile device? Based on OS.
         * Encapsulates the decision
         * 
         * @return {Bool}
         */
        mobile: function() {
            return this.os.iOS || this.os.android
        }
    };
    
    return Device;
});