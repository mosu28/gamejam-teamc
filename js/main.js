enchant();

var game = null;

window.onload = function() {
    game = new Game(1600, 600);
    game.fps = 40;
    game.preload('./img/Player.png');
    game.preload('./img/Enemy.png');
    game.preload('./img/Kari/test.png');
    game.preload('./img/Kari/cut_fujisan2.gif');
    game.preload('./img/street.png');
    game.preload('./img/start.png');
    game.onload = function() {
        var gameoverImage = new Label("うわああああん疲れたもおおおん");
        gameoverImage.color = "#fff";
        game.rootScene.addChild(gameoverImage);
        var botton = new Sprite(236,48);
        botton.image = game.assets['./img/start.png'];
        botton.moveTo(400,300);
        game.rootScene.addChild(botton);
        botton.ontouchstart = function() {
            lootgame();
        }
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
        this.frame = this.frame == 2? 0 : this.frame + 0.25;
    },
    jump: function() {
        if (this.y != this.high) return;
        this.tl.moveBy(0, -160, 20, enchant.Easing.CUBIC_EASEOUT)
            .moveBy(0, 160, 20, enchant.Easing.CUBIC_EASEIN);
    },
    dead:function(){
        alert('GAME OVER!!');
        this.frame = 3;
        gameover();
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 138, 200);
        this.x = 1500;
        this.y = 130;
        this.image = game.assets['./img/Enemy.png'];
        this.frame = 0;
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

var gameover = function() {
    var scene = new Scene();
    scene.backgroundColor = 'rgba(0,0,0,1)';
    var gameoverImage = new Label("うわああああん疲れたもおおおん");
    gameoverImage.x = 400;                                      // 横位置調整
    gameoverImage.y = 200;
    gameoverImage.width=700;
    gameoverImage.color = '#fff';
    gameoverImage.font = "50px cursive";
    scene.addChild(gameoverImage);
    game.replaceScene(scene);
    scene.ontouchstart = function() {
        game.popScene();
    }
};

var lootgame = function(){
    var scene = new Scene();
    game.frame = 0;
    var background = new Sprite(750, 250);
    street1 = new Sprite(1600, 600),
        street2 = new Sprite(1600, 600);
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
    scene.addChild(background);
    scene.addChild(street1);
    scene.addChild(street2);
    var player = new Player();
    var enemies = [];
    scene.addChild(player);
    scene.backgroundColor = '#7ecef4';

    var pts = 0;
    var scorelabel = new Label("");
    scorelabel.color = '#000';
    scorelabel.moveTo( 10, 20 );
    scene.addChild(scorelabel);

    scene.addEventListener(Event.ENTER_FRAME, function() {
        player.walk();
        pts += parseInt(100*game.frame/game.fps);
        scorelabel.text = pts.toString()+'pts';
        if ((game.frame % (game.fps * 2) == 0) && Math.floor(Math.random() * 11) >= 4) {
            enemies.push(new Enemy());
            scene.addChild(enemies[enemies.length - 1]);
        }

        if (checkIntersect(player, enemies)) {
            player.tl.moveBy(0, -50, 3, enchant.Easing.CUBIC_EASEOUT)
                .moveBy(0, 300, 5, enchant.Easing.CUBIC_EASEIN)
                .then(function(){
                    player.dead();
                })
            // console.log('GAME OVER!!');
        }

    });
    scene.addEventListener(Event.TOUCH_START, function(e) {
        player.jump();
    });
    game.pushScene(scene);
}