define([], function() {
    // is device ios.. etc.
    var Device = {
        isTouch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        
        os: {
            iOS: (/iP(hone|od|ad)/i).test(navigator.userAgent.toLowerCase()),
            android: (/android/i).test(navigator.userAgent.toLowerCase())
        },
        browser: {
            firefox: (/firefox/i).test(navigator.userAgent.toLowerCase()),
            chrome: (/chrome/i).test(navigator.userAgent.toLowerCase())  && (/google/i).test(navigator.vendor.toLowerCase()),
            safari: (/safari/i).test(navigator.userAgent.toLowerCase()) && (/apple/i).test(navigator.vendor.toLowerCase()),
            opera: (/opera/i).test(navigator.userAgent.toLowerCase()),
        },
        
        mobile: function() {
            return this.os.iOS || this.os.android
        }
    };
    
    return Device;
});