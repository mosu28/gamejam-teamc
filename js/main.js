enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 24;
    game.preload('./img/chara1.png');
    game.onload = function() {
        // ここにメインプログラムを書く
    }
    game.start();
};