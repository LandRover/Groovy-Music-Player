define([
    "core",
    "core/init"
], function(gPlayer) {
    /* global __webpack_public_path__:true */
    __webpack_public_path__ = 'get current path here! @todo';
    
    return (window.gPlayer = gPlayer);
});