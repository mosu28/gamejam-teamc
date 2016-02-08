enchant();

var game = null;

window.onload = function() {
    game = new Game(480, 270);
    game.fps = 10;
    game.preload('./img/Kari/test.png');
    game.preload('./img/Kari/cut_fujisan2.gif');
    game.onload = function() {
        game.frame = 0;
        var background1 = new Sprite(750, 250),
            background2 = new Sprite(750, 250);
        background1.image = background2.image = game.assets['./img/Kari/cut_fujisan2.gif'];
        background1.onenterframe = function() {
            if (background2.x + background2.width == game.width) {
                background1.moveTo(game.width, 0);
            }
            background1.x -= 5;
        }
        background2.onenterframe = function() {
            if (background1.x + background1.width == game.width) {
                background2.moveTo(game.width, 0);
            }
            background2.x -= 5;
        }
        game.rootScene.addChild(background1);
        game.rootScene.addChild(background2);
        var player = new Player();
        game.rootScene.addChild(player);
        game.rootScene.backgroundColor = '#7ecef4';
        game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
            player.walk();
            if ((game.frame % (game.fps * 2) == 0) && Math.floor(Math.random() * 11) >= 4) {
                game.rootScene.addChild(new Enemy());
            }
        });
        game.rootScene.addEventListener(Event.TOUCH_START, function(e) {
            player.jump();
        });
    }
    game.start();
};

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 32, 32);
        this.x = 80;
        this.y = 200;
        this.high = this.y,
        this.isJump = false;
        this.frame = 0;
        this.image = game.assets['./img/Kari/test.png'];
    },
    walk: function() {
        this.frame = this.frame == 2? 0 : this.frame + 1;
    },
    jump: function() {
        if (this.y != this.high) return;
        this.tl.moveBy(0, -80, 5, enchant.Easing.CUBIC_EASEOUT)
            .moveBy(0, 80, 5, enchant.Easing.CUBIC_EASEIN);
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 32, 32);
        this.x = 500;
        this.y = 200;
        this.image = game.assets['./img/Kari/test.png'];
        this.frame = 5;
        this.onenterframe = function() {
            this.x -= 5;
        }
    },
    summon: function() {
        var ota = new Ota(32, 32);
        ota.x = this.x + 30;
        ota.y = this.y;
    }
});

var Ota = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 32, 32);
    }
});
