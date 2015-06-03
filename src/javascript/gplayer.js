define([
    "./core",
    "./player",
    "./exports/amd"
], function(gPlayer, Player) {
    return (window.gPlayer = gPlayer);
});