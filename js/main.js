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
    game.preload('./img/Otaku.png');
    game.onload = function() {
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
        game.rootScene.addChild(background);
        game.rootScene.addChild(street1);
        game.rootScene.addChild(street2);
        var player = new Player();
        var enemies = [];
        game.rootScene.addChild(player);
        game.rootScene.backgroundColor = '#7ecef4';

        var pts = 0;
        var scorelabel = new Label("");
        scorelabel.color = '#ffff';
        scorelabel.moveTo( 10, 20 );
        game.rootScene.addChild(scorelabel);

        game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
            player.walk();
            pts += parseInt(100*game.frame/game.fps);
            scorelabel.text = pts.toString()+'pts';
            if ((game.frame % (game.fps * 2) == 0) && Math.floor(Math.random() * 11) >= 6) {
                enemies.push(new Enemy());
                game.rootScene.addChild(enemies[enemies.length - 1]);
            }


            if (checkIntersect(player, enemies)) {
                // player.tl.moveBy(0, -50, 3, enchant.Easing.CUBIC_EASEOUT)
                //     .moveBy(0, 300, 5, enchant.Easing.CUBIC_EASEIN)
                    // .then(function(){
                        player.dead();
                    // })
                console.log('GAME OVER!!');
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
        this.frame = this.frame == 3? 0 : this.frame + 0.125;
    },
    jump: function() {
        if (this.y != this.high) return;
        this.tl.moveBy(0, -160, 20, enchant.Easing.CUBIC_EASEOUT)
            .moveBy(0, 160, 20, enchant.Easing.CUBIC_EASEIN);
    },
    dead:function(){
        alert('GAME OVER!!');
        this.frame = 3;
        game.end();
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 138, 200);
        this.x = 1500;
        this.y = 130;
        this.image = game.assets['./img/Enemy.png'];
        this.frame = 0;
        this.isSummon = false;
        this.otaku = null;
        this.onenterframe = function() {
            this.frame = this.frame == 2? 2 : this.frame + 0.0625;
            this.x -= 5;
            if (this.frame == 2 && !this.isSummon) {
                this.isSummon = true;
                this.otaku = this.summon();
                game.rootScene.addChild(this.otaku);
            }
        }
    },
    summon: function() {
        var ota = new Ota();
        ota.x = this.x + 100;
        ota.y = this.y - 20;
        return ota;
    }
});

var Ota = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 88, 236);
        this.image = game.assets['./img/Otaku.png'];
        this.vs = 5;
        this.tl.delay(20)
            .then(function() {
                this.rotate(-90);
                this.y += 40;
                this.vs = 15;
            });
        this.onenterframe = function() {
            this.x -= this.vs;
        }
    }
});


function checkIntersect(player, enemies) {
    for (var i = 0;i < enemies.length;i++) {
        if (enemies[i].otaku !== null && player.within(enemies[i].otaku, 118)) {
            return true;
        }
    }
    return false;
}