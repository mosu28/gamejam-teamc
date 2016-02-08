enchant();

var game = null;

window.onload = function() {
    game = new Game(800, 600);
    game.fps = 20;
    game.preload('./img/Player.png');
    game.preload('./img/Kari/test.png');
    game.preload('./img/Kari/cut_fujisan2.gif');
    game.preload('./img/street.png');
    game.onload = function() {
        game.frame = 0;
        var background = new Sprite(750, 250),
            street1 = new Sprite(800, 600),
            street2 = new Sprite(800, 600);
        street1.image = street2.image = game.assets['./img/street.png'];
        street1.onenterframe = function() {
            if (street2.x + street2.width == game.width) {
                street1.moveTo(game.width, 0);
            }
            street1.x -= 5;
        }
        street2.onenterframe = function() {
            if (street1.x + street1.width == game.width) {
                street2.moveTo(game.width, 0);
            }
            street2.x -= 5;
        }
        game.rootScene.addChild(street1);
        game.rootScene.addChild(street2);
        var player = new Player();
        var enemies = [];
        game.rootScene.addChild(player);
        game.rootScene.backgroundColor = '#7ecef4';
        game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
            player.walk();
            if ((game.frame % (game.fps * 2) == 0) && Math.floor(Math.random() * 11) >= 4) {
                enemies.push(new Enemy());
                game.rootScene.addChild(enemies[enemies.length - 1]);
            }
            if (checkIntersect(player, enemies)) {
                player.tl.moveBy(0, -50, 3, enchant.Easing.CUBIC_EASEOUT)
                    .moveBy(0, 300, 5, enchant.Easing.CUBIC_EASEIN);
                alert('GAME OVER!!');
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
        enchant.Sprite.call(this, 138, 190);
        this.x = 50;
        this.y = 140;
        this.high = this.y,
        this.isJump = false;
        this.frame = 0;
        this.image = game.assets['./img/Player.png'];
    },
    walk: function() {
        this.frame = this.frame == 2? 0 : this.frame + 0.5;
    },
    jump: function() {
        if (this.y != this.high) return;
        this.tl.moveBy(0, -80, 10, enchant.Easing.CUBIC_EASEOUT)
            .moveBy(0, 80, 10, enchant.Easing.CUBIC_EASEIN);
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

function checkIntersect(player, enemies) {
    for (var i = 0;i < enemies.length;i++) {
        if (player.within(enemies[i], 20)) {
            return true;
        }
    }
    return false;
}