enchant();

window.onload = function() {
    var game = new Game(480, 270);
    game.fps = 10;
    game.preload('./img/Kari/test.png');
    game.preload('./img/Kari/cut_fujisan2.gif');
    game.onload = function() {
        var background1 = new Sprite(750, 250),
            background2 = new Sprite(750, 250);
        background1.image = background2.image = game.assets['./img/Kari/cut_fujisan2.gif'];
        background1.onenterframe = function() {
            if (background2.x + background2.width == game.width) {
                background1.moveTo(game.width, 0);
            }
            background1.x -= 10;
        }
        background2.onenterframe = function() {
            if (background1.x + background1.width == game.width) {
                background2.moveTo(game.width, 0);
            }
            background2.x -= 10;
        }
        game.rootScene.addChild(background1);
        game.rootScene.addChild(background2);
        var player = new Player();
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
