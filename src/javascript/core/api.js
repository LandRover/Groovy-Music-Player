define([
    "../core",
    "../utils/logger"
], function(gPlayer, Logger) {
    console.log('CORE/API LOADED 05');
    
    var API = {
        entry: function() {
            console.log('ON entry!');
            console.log(arguments);
        },
        
        on: function() {
            console.log('ON FIRED!');
        }
    };
    
    return API;
});