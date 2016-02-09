enchant();

var BORDER_POINT = 1000000;

var game = null;
var lootscene = null,
    resultscene = null;


window.onload = function() {
    game = new Game(1600, 600);
    game.fps = 40;
    game.preload('./img/Player.png');
    game.preload('./img/Enemy.png');
    game.preload('./img/Kari/test.png');
    game.preload('./img/Kari/cut_fujisan2.gif');
    game.preload('./img/street.png');
    game.preload('./img/start.png');
    game.preload('./img/Otaku.png');
    game.preload('./img/school.png');
    game.onload = function() {
        var botton = new Sprite(236,48);
        botton.image = game.assets['./img/start.png'];
        botton.x = 50;
        botton.y = 100;
        game.rootScene.addChild(botton);
        botton.ontouchstart = function() {
            lootgame();
        }
    };
    game.start();
};

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 138, 210);
        this.x = 220;
        this.y = 130;
        this.high = this.y,
            this.isJump = false;
        this.frame = 4;
        this.image = game.assets['./img/Player.png'];
    },
    walk: function() {
        if (this.frame != 5) {
            this.frame = this.frame >= 3? 0 : this.frame + 0.125;
        }
    },
    jump: function() {
        if (this.y != this.high) return;
        this.frame = 5;
        this.tl.moveBy(0, -160, 20, enchant.Easing.CUBIC_EASEOUT)
            .moveBy(0, 160, 20, enchant.Easing.CUBIC_EASEIN)
            .then(function() {
                this.frame = 1;
            });
    },
    dead:function(score){
        alert('GAME OVER!!');
        this.frame = 3;
        gameover(score);
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
                lootscene.addChild(this.otaku);
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

var School = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 298, 304);
        this.image = game.assets['./img/school.png'];
        this.x = 1700;
        this.y = 0;
        this.speed = 5;
        this.onenterframe = function() {
            this.x -= this.speed;
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

function removeAvoidance(player, enemies) {
    // for (var i = 0;i < enemies.length;i++) {
    //     if (player.x > enemies[i].otaku.x) {
    //         enemies[i]
    //         lootscene.removeChild(enemies[i]);
    //     }
    // }
}

function removeEnemies(enemies) {
    for (var i = 0;i < enemies.length;i++) {
        lootscene.removeChild(enemies[i].otaku);
        lootscene.removeChild(enemies[i]);
    }
}

var gameover = function(score) {
    resultscene = new Scene();
    resultscene.backgroundColor = 'rgba(0,0,0,1)';
    var resultTitle = new Label("獲得スコア: " + score);
    resultTitle.x = 300;
    resultTitle.y = 150;
    resultTitle.width = 700;
    resultTitle.color = '#fff';
    resultTitle.font = "50px cursive";
    resultscene.addChild(resultTitle);
    var gameoverImage = new Label("タイトルに戻る");
    gameoverImage.x = 400;                                      // 横位置調整
    gameoverImage.y = 300;
    gameoverImage.width=700;
    gameoverImage.color = '#fff';
    gameoverImage.font = "50px cursive";
    resultscene.addChild(gameoverImage);
    game.replaceScene(resultscene);
    gameoverImage.ontouchstart = function() {
        game.popScene();
    }
};

var lootgame = function(){
    lootscene = new Scene();
    game.frame = 0;
    var st1_speed = 5, st2_speed = 5;
    var street1 = new Sprite(1600, 600),
        street2 = new Sprite(1600, 600);
    street1.image = street2.image = game.assets['./img/street.png'];
    street1.onenterframe = function() {
        if (street2.x + street2.width == game.width) {
            street1.moveTo(game.width, 0);
        }
        street1.x -= st1_speed;
    };
    street2.onenterframe = function() {
        if (street1.x + street1.width == game.width) {
            street2.moveTo(game.width, 0);
        }
        street2.x -= st2_speed;
    };
    lootscene.addChild(street1);
    lootscene.addChild(street2);
    var player = new Player();
    var enemies = [];
    var school = null;
    var isEnd = false;
    lootscene.addChild(player);
    lootscene.backgroundColor = '#7ecef4';

    var pts = 0;
    var scorelabel = new Label("");
    scorelabel.color = '#000';
    scorelabel.font = "40px cursive";
    scorelabel.moveTo( 10, 20 );
    lootscene.addChild(scorelabel);

    lootscene.addEventListener(Event.ENTER_FRAME, function() {
        player.walk();
        if (checkIntersect(player, enemies)) {
            // player.tl.moveBy(0, -50, 3, enchant.Easing.CUBIC_EASEOUT)
            //     .moveBy(0, 300, 5, enchant.Easing.CUBIC_EASEIN)
            //     .then(function(){
                    player.dead(scorelabel.text);
                // })
            // console.log('GAME OVER!!');
        }
        pts = isEnd? pts : pts + parseInt(10*game.frame/game.fps);
        scorelabel.text = pts.toString()+'pts';
        if (!isEnd && (game.frame % (game.fps * 2) == 0) && Math.floor(Math.random() * 11) >= 4) {
            enemies.push(new Enemy());
            lootscene.insertBefore(enemies[enemies.length - 1], player);
        }

        if (pts > BORDER_POINT && school == null) {
            isSchool = true;
            school = new School();
            lootscene.insertBefore(school, enemies[enemies.length - 1]);
        }
        removeAvoidance(player, enemies);
        if (school !== null && player.intersect(school)) {
            removeEnemies(enemies);
        }
        if (school !== null && player.within(school, 100) && !isEnd) {
            isEnd = true;
            school.speed = st1_speed = st2_speed = 0;
            player.tl.moveBy(100, -120, 40, enchant.Easing.CUBIC_EASEOUT)
                .scaleBy(0, 40, enchant.Easing.CUBIC_EASEOUT)
                .then(function() {
                    window.location.href = "./ending.html";
                });
        }
    });
    lootscene.addEventListener(Event.TOUCH_START, function(e) {
        player.jump();
    });
    game.pushScene(lootscene);
    three();
};

var three = function(){
    counter = new Scene();
    counter.backgroundColor = 'rgba(0,0,0,0.2)';
    var name = new Label("3");
    name.x = 300;
    name.y = 150;
    name.width = 700;
    name.color = '#fff';
    name.font = "50px cursive";
    counter.addChild(name);
    game.pushScene(counter);
    counter.tl.delay(50)
        .then(function() {
           two();
        });
};

var two = function(){
    counter = new Scene();
    counter.backgroundColor = 'rgba(0,0,0,0.2)';
    var name = new Label("2");
    name.x = 300;
    name.y = 150;
    name.width = 700;
    name.color = '#fff';
    name.font = "50px cursive";
    counter.addChild(name);
    game.replaceScene(counter);
    counter.tl.delay(50)
        .then(function() {
            one();
        });
};

var one = function(){
    counter = new Scene();
    counter.backgroundColor = 'rgba(0,0,0,0.2)';
    var name = new Label("1");
    name.x = 300;
    name.y = 150;
    name.width = 700;
    name.color = '#fff';
    name.font = "50px cursive";
    counter.addChild(name);
    game.replaceScene(counter);
    counter.tl.delay(50)
        .then(function() {
            game.popScene();
        });
};