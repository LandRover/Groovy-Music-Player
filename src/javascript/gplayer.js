define([
    "./core",
    "./player",
    "./exports/amd"
], function(gPlayer, Player) {
    /* global __webpack_public_path__:true */
    __webpack_public_path__ = 'get current path here! @todo';
    
    console.log(gPlayer);
    
    return (window.gPlayer = gPlayer);
});
