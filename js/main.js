enchant();

window.onload = function() {
    var game = new Game(480, 270);
    game.fps = 10;
    game.preload('./img/Kari/test.png');
    game.onload = function() {
        var player = new Player(32, 32, './img/Kari/test.png');
        player.image = game.assets['./img/Kari/test.png'];
        game.rootScene.addChild(player);
        game.rootScene.backgroundColor = '#7ecef4';
        game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
            player.walk();
        });
        game.rootScene.addEventListener(Event.TOUCH_START, function(e) {
            player.jump();
        });
    }
    game.start();
};
